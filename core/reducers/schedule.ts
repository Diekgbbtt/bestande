import {createSelector} from 'reselect';
import {
	FetchScheduleAction,
	FETCH_SCHEDULE,
	FETCH_SCHEDULES,
	GetMultipleSchedulesAction,
	ReceiveScheduleAction,
	ReceiveSchedulesAction,
	RECEIVE_SCHEDULE,
	RECEIVE_SCHEDULES,
} from '../actions/schedule';
import {getCredit} from '../functions/get-credit';
import {getSchedule} from '../functions/get-next-event-from-credit';
import {schedulecacheKey} from '../functions/schedule-cache-key';
import {Institution} from '../models/credit';
import {AppState} from '../types/app-state';
import {IndividualScheduleState} from './IndividualScheduleState';

export const reduceSchedule = createSelector(
	[
		(state: AppState) => state.schedule,
		(state: AppState, uni_identifier: string | null, semester: string) =>
			semester,
		(
			state: AppState,
			uni_identifier: string,
			semester: string,
			institution: Institution
		) => getCredit(state, uni_identifier, semester, institution),
	],
	(sched, semester, credit) => {
		return getSchedule(sched, credit, semester);
	}
);

const emptyState: {[key: string]: IndividualScheduleState} = {};

export const schedule = (
	state = {},
	action:
		| FetchScheduleAction
		| ReceiveScheduleAction
		| GetMultipleSchedulesAction
		| ReceiveSchedulesAction
) => {
	switch (action.type) {
		case FETCH_SCHEDULE:
			return {
				...state,
				[schedulecacheKey(action.credit, action.semester)]: {
					loading: true,
					schedule: null,
				},
			};
		case RECEIVE_SCHEDULE:
			return {
				...state,
				[schedulecacheKey(action.credit, action.semester)]: {
					loading: false,
					schedule: action.schedule,
				},
			};
		case FETCH_SCHEDULES:
			return {
				...state,
				...action.items.reduce((obj, item) => {
					obj[schedulecacheKey(item[0], item[1])] = {
						loading: true,
						schedule: null,
					};
					return obj;
				}, emptyState),
			};
		case RECEIVE_SCHEDULES:
			return {
				...state,
				...action.items.reduce((obj, item) => {
					obj[schedulecacheKey(item[0], item[1])] = {
						loading: false,
						schedule: item[2],
					};
					return obj;
				}, emptyState),
			};
		default:
			return state;
	}
};
