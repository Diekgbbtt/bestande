import {Router} from 'express';
import createHttpError from 'http-errors';
import {humanToPeriod} from '../../../../core/functions/uzh-period';
import {GetEventResponse} from '../../../../core/types/types';
import {eventCollection, moduleCollection} from '../../db/collections';
import {getManyPeople} from '../../db/get-many-people';
import {asyncHandler} from '../../handlers';

export const eventRouter = Router();

eventRouter.get(
	'/:eventserieid/:id/:semester',
	asyncHandler<
		{
			params: {
				eventserieid: string;
				id: string;
				semester: string;
			};
		},
		GetEventResponse
	>(async (req, res) => {
		const {eventserieid, id, semester} = req.params;
		const period = humanToPeriod(semester);
		if (period === null) {
			throw createHttpError(400, 'Wrong period');
		}

		const event = await eventCollection().findOne({
			event_serie_id: eventserieid,
			id,
			university: res.locals.institution,
			period,
		});
		if (!event) {
			throw createHttpError(404, 'Event not found');
		}

		const matchingCourse = await moduleCollection().findOne({
			semesters: {$elemMatch: {'event_series.id': eventserieid, period}},
		});
		if (!matchingCourse) {
			throw createHttpError(404, 'Course not found');
		}

		const event_serie = matchingCourse.semesters
			.find((s) => s.period === period)
			?.event_series.find((e) => e.id === eventserieid);
		if (!event_serie) {
			throw createHttpError(404, 'Event serie not found');
		}

		const people = await getManyPeople(
			res.locals.institution,
			event_serie.people
		);
		return {event, event_serie: {...event_serie, people, events: []}};
	})
);
