import {Router} from 'express';
import createError from 'http-errors';
import sortBy from 'lodash/sortBy';
import uniqBy from 'lodash/uniqBy';
import {
	humanToPeriod,
	periodToString,
} from '../../../../core/functions/uzh-period';
import {Institution} from '../../../../core/models/credit';
import Module from '../../../../core/models/module';
import Semester from '../../../../core/models/semester';
import {
	EventSerieType,
	EventSerieWithEventsAndPeople,
	EventType,
	ScheduleApiResponse,
} from '../../../../core/types/schedule';
import {ExpandedExamReturnStatistic} from '../../../../core/types/types';
import {
	eventCollection,
	examReturnsCollection,
	userCollection,
} from '../../db/collections';
import {getManyPeople} from '../../db/get-many-people';
import {asyncHandler, asyncNextHandler} from '../../handlers';
import {databaseUserToUser} from '../../helpers/database-user-to-user';

const router = Router();

router.get(
	'/',
	asyncHandler<
		{},
		{
			semesters: string[];
		}
	>(async (request, response) => {
		const {semesters}: {semesters: Semester[]} = await response.locals.module;
		const strings: number[] = semesters.map((s) => s.period);
		return {
			semesters: strings.map((s) => periodToString(s)),
		};
	})
);

const getSemesterFromQueryString = (module, queryString) => {
	const period = humanToPeriod(queryString);
	return module.semesters.find((s) => s.period === period);
};

router.use(
	'/:sem',
	asyncNextHandler<{
		params: {
			sem: string;
		};
	}>(async (request, response, next) => {
		const {sem} = request.params;
		const module = await response.locals.module;
		const semester = getSemesterFromQueryString(module, sem);
		if (!semester) {
			throw createError(
				404,
				`Semester ${sem} does not exist on ${module.uni_identifier}`
			);
		}

		response.locals.semester = semester;
		next();
	})
);

router.get(
	'/:sem',
	asyncHandler((request, response) => {
		const {semester} = response.locals;
		return semester;
	})
);

const getEventsForSerie = (
	event_serie_id: string,
	university: Institution,
	period: number
): Promise<EventType[]> => {
	return eventCollection()
		.find({
			event_serie_id,
			university,
			period,
		})
		.toArray();
};

const getTimeTableData = async ({
	module,
	semester,
}: {
	module: Module;
	semester: Semester;
}): Promise<ScheduleApiResponse> => {
	const {event_series} = semester;
	const dataPromise = Promise.all(
		sortBy(event_series as EventSerieType[], (e) => e.id).map(async (serie) => {
			const [events, people] = await Promise.all([
				getEventsForSerie(
					serie.id as string,
					module.university,
					semester.period
				),
				getManyPeople(module.university, serie.people),
			]);
			return {
				...serie,
				people,
				// TODO: Not filter, re-index events.
				// db.getCollection('events').find({'event_serie_id': '1298312-0', id: '1', university: 'ETH', period: 20172})
				// => Duplicates
				events: uniqBy(
					sortBy(events, (e) => new Date(e.start_date as string).getTime()),
					(e) => e.university + e.event_serie_id + e.id + e.period
				),
			};
		})
	);
	const [data, returnStatistic] = await Promise.all([
		dataPromise,
		(async (): Promise<ExpandedExamReturnStatistic | null> => {
			const examReturn = await examReturnsCollection().findOne({
				period: semester.period,
				uni_identifier: module.uni_identifier,
				university: module.university,
			});
			if (!examReturn) {
				return null;
			}

			const user = await userCollection().findOne({
				id: examReturn?.reporter as string,
			});
			return {
				...examReturn,
				reporter: user ? databaseUserToUser(user) : null,
			};
		})(),
	]);
	return {
		data: data as EventSerieWithEventsAndPeople[],
		gradesOut: returnStatistic,
		version: 16,
	};
};

router.get(
	'/:sem/timetable',
	asyncHandler<
		{},
		{
			data: any[];
			version: number;
		}
	>(async (request, response) => {
		const {semester, module} = response.locals;
		return getTimeTableData({semester, module});
	})
);

export default router;
