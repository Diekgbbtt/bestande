import {PeriodHuman} from '../models/credit';

export const SET_SEMESTER = 'SET_SEMESTER';
export const SET_WEEK = 'SET_WEEK';

export type SetSemesterAction = {
	type: 'SET_SEMESTER';
	semester: PeriodHuman;
};

export function setSemester(semester: PeriodHuman): SetSemesterAction {
	return {
		type: SET_SEMESTER,
		semester,
	};
}

export type SetWeekAction = {
	type: 'SET_WEEK';
	week: number;
	semester: string;
};

export function setWeek(semester: string, week: number): SetWeekAction {
	return {
		type: SET_WEEK,
		week,
		semester,
	};
}
