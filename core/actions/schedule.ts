import {Credit} from '../models/credit';

export const FETCH_SCHEDULE = 'FETCH_SCHEDULE';
export const RECEIVE_SCHEDULE = 'RECEIVE_SCHEDULE';

export const FETCH_SCHEDULES = 'FETCH_SCHEDULES';
export const RECEIVE_SCHEDULES = 'RECEIVE_SCHEDULES';

export type FetchScheduleAction = {
	type: 'FETCH_SCHEDULE';
	credit: Credit;
	semester: string;
};

export type ReceiveScheduleAction = {
	type: 'RECEIVE_SCHEDULE';
	schedule: any;
	semester: string;
	credit: Credit;
};

export type GetMultipleSchedulesAction = {
	type: 'FETCH_SCHEDULES';
	items: [Credit, string][];
};

export type ReceiveSchedulesAction = {
	type: 'RECEIVE_SCHEDULES';
	items: any[][];
};
