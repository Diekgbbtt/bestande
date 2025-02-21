import flatten from 'lodash/flatten';
import sortBy from 'lodash/sortBy';
import {Credit} from '../models/credit';
import {IndividualScheduleState} from '../reducers/IndividualScheduleState';
import {ScheduleReducerState} from '../reducers/ScheduleReducerState';
import {SeriesConfigState} from '../reducers/seriesConfig';
import {EventSerieWithEventsAndPeople, EventType} from '../types/schedule';
import {SerieConfig} from '../types/serie-config';
import {EventHelpers} from './EventHelpers';
import {getUniqueIdentifier} from './get-unique-identifier';
import {schedulecacheKey} from './schedule-cache-key';
import {SeriesConfig} from './SeriesConfig';

export const initialScheduleState: IndividualScheduleState = {
	loading: false,
	schedule: null,
};

export const getSchedule = (
	schedule: ScheduleReducerState,
	credit: Credit,
	semester: string
): IndividualScheduleState => {
	const reducerSchedule =
		schedule[schedulecacheKey(credit, semester)] || initialScheduleState;

	return {
		...reducerSchedule,
		schedule: reducerSchedule?.schedule
			? [
					...reducerSchedule.schedule,
					/*
						Enable this for personal exams from ETH
						...(credit && credit.exams_events && credit.exams_events.length > 0
							? [
									{
										category: 'EXAM',
										people: [],
										id:
											credit.exams_events[0].uni_identifier + '-personal-exam',
										time_label: 'Persönlicher Prüfungstermin', // TODO
										events: credit.exams_events
									}
							  ]
							: [])
							*/
			  ]
			: [],
	};
};

const getSeriesConfig = (
	seriesConfig: SeriesConfigState,
	schedule: IndividualScheduleState,
	credit: Credit
): SerieConfig | null => {
	if (!schedule.schedule) {
		return null;
	}

	const config = seriesConfig[getUniqueIdentifier(credit, true)];
	if (!config) {
		return SeriesConfig.getDefault(schedule.schedule);
	}

	return config;
};

export type EventSeriePlusEvent = {
	event: EventType;
	eventSerie: EventSerieWithEventsAndPeople;
	number: number;
};

const getNextEvent = (
	schedule: IndividualScheduleState,
	seriesConfig: SerieConfig | null
): EventSeriePlusEvent | null => {
	if (schedule.loading) {
		return null;
	}

	if (!schedule.schedule) {
		return null;
	}

	if (!seriesConfig) {
		return null;
	}

	const events = flatten(
		schedule.schedule.map((c) =>
			c.events.map(
				(e, i): EventSeriePlusEvent => ({
					event: e,
					eventSerie: c,
					number: i + 1,
				})
			)
		)
	);
	return (
		sortBy(events, (e) => e.event.end_date).find(({event}) => {
			return (
				EventHelpers.isInFuture(event.end_date) &&
				seriesConfig[`e-${event.event_serie_id}.termine.html`]
			);
		}) ?? null
	);
};

export const getNextEventFromCredit = (
	scheduleState: ScheduleReducerState,
	seriesConfigState: SeriesConfigState,
	credit: Credit,
	semester: string
) => {
	const schedule = getSchedule(scheduleState, credit, semester);
	if (!schedule.schedule) {
		return null;
	}

	const seriesConfig = getSeriesConfig(seriesConfigState, schedule, credit);
	return getNextEvent(schedule, seriesConfig);
};
