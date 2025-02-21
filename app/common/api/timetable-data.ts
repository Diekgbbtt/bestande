import flatten from 'lodash/flatten';
import sortBy from 'lodash/sortBy';
import {createSelector} from 'reselect';
import {CreditHelpers} from '../../../core/functions/CreditHelpers';
import {getModuleId} from '../../../core/functions/get-module-id';
import {getSchedule} from '../../../core/functions/get-next-event-from-credit';
import {getUniqueIdentifier} from '../../../core/functions/get-unique-identifier';
import {schedulecacheKey} from '../../../core/functions/schedule-cache-key';
import {SeriesConfig} from '../../../core/functions/SeriesConfig';
import {Credit} from '../../../core/models/credit';
import {AppState} from '../../../core/types/app-state';
import {
	EventSerieWithEventsAndPeople,
	EventType,
} from '../../../core/types/schedule';
import {SeriesConfigType} from '../../../core/types/serie-config';
import {navigateableCredits} from '../selectors/credits';
import {EventAndEventSerie} from '../types/event-and-event-serie';
import {getAvailableSemesters} from './available-semesters';

const getEvents = (
	schedule: TimeTableSchedule,
	seriesConfig: SeriesConfigType
): EventAndEventSerie[] => {
	if (!schedule.every(Boolean)) {
		return [];
	}

	return flatten(
		schedule.map((module) => {
			const {series, credit} = module;
			const config =
				seriesConfig[getUniqueIdentifier(credit, true)] ||
				SeriesConfig.getDefault(series);
			return flatten(
				series
					.filter((s) => SeriesConfig.serieIsActivated(config, s))
					.map((s) =>
						s.events.map(
							(ev, i): EventAndEventSerie => {
								return {
									number: i + 1,
									event: ev,
									eventSerie: s,
									uni_identifier: getModuleId(credit) as string,
									university: CreditHelpers.getInstitution(credit),
								};
							}
						)
					)
			);
		})
	);
};

const weekClosestToNow = (
	schedule: TimeTableSchedule,
	events: EventType[]
): number => {
	const now = Date.now();
	if (schedule.length === 0) {
		return now;
	}

	if (events.length === 0) {
		return now;
	}

	return sortBy(
		events.map((c) => new Date(c.start_date as Date).getTime()),
		(t) => Math.abs(now - t)
	)[0];
};

type TimeTableSchedule = {
	series: EventSerieWithEventsAndPeople[];
	credit: Credit;
}[];

export const getTimeTableData = createSelector(
	[
		navigateableCredits,
		(state: AppState) => state.seriesConfig,
		getAvailableSemesters,
		(state: AppState) => state.timetable.semester,
		(state: AppState) => state.schedule,
	],
	(
		credits,
		seriesConfig,
		availableSemesters,
		timetableSemester,
		stateSchedule
	) => {
		const semester = timetableSemester || availableSemesters[0];

		const bookedModules = credits.filter(
			(c) =>
				CreditHelpers.getSemester(c) === semester && c.status !== 'DESELECTED'
		);
		const schedule: TimeTableSchedule = bookedModules
			.map((c) => {
				if (!stateSchedule[schedulecacheKey(c, semester)]) {
					return null;
				}

				return {
					series: getSchedule(stateSchedule, c, semester).schedule || [],
					credit: c,
				};
			})
			.filter(
				(
					x
				): x is {
					series: EventSerieWithEventsAndPeople[];
					credit: Credit;
				} => x !== null
			);

		const events = getEvents(schedule, seriesConfig);
		const currentWeek = weekClosestToNow(
			schedule,
			events.map(({event}) => event)
		);
		return {
			schedule,
			bookedModules,
			semester,
			availableSemesters,
			credits,
			events,
			currentWeek,
		};
	}
);
