import {Institution} from '../../../core/models/credit';
import {ScheduleApiResponse, ScheduleState} from '../../../core/types/schedule';

const FETCH_SCHEDULE = 'FETCH_SCHEDULE';
export const RECEIVE_SCHEDULE = 'RECEIVE_SCHEDULE';

type ReceiveScheduleActionWeb = {
	type: 'RECEIVE_SCHEDULE';
	institution: Institution;
	uni_identifier: string;
	semester: string;
	schedule: ScheduleApiResponse;
};

type WebFetchSchedule = {
	type: 'FETCH_SCHEDULE';
	institution: Institution;
	uni_identifier: string;
	semester: string;
};

export default function schedule(
	state: ScheduleState = {},
	action: WebFetchSchedule | ReceiveScheduleActionWeb
): ScheduleState {
	const {institution, uni_identifier, semester} = action;
	const key = [institution, uni_identifier, semester].join('/');
	switch (action.type) {
		case FETCH_SCHEDULE:
			return {
				...state,
				[key]: {
					loading: true,
					schedule: null,
					error: null,
				},
			};
		case RECEIVE_SCHEDULE:
			return {
				...state,
				[key]: {
					loading: false,
					schedule: action.schedule,
					error: null,
				},
			};
		default:
			return state;
	}
}
