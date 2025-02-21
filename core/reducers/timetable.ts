import {
	SetSemesterAction,
	SetWeekAction,
	SET_SEMESTER,
	SET_WEEK,
} from '../actions/timetable';
import {TimeTableState} from '../types/timetable-state';

const initialState: TimeTableState = {
	semester: null,
	weeks: {},
};

type Actions = SetSemesterAction | SetWeekAction;

export const timetable = (
	state = initialState,
	action: Actions
): TimeTableState => {
	switch (action.type) {
		case SET_SEMESTER:
			return {
				...state,
				semester: action.semester,
			};
		case SET_WEEK:
			return {
				...state,
				weeks: {
					...state.weeks,
					[action.semester]: action.week,
				},
			};
		default:
			return state;
	}
};
