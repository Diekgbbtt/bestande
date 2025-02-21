import uniqBy from 'lodash/uniqBy';
import {ReceiveSchedulesAction} from '../actions/schedule';
import {Institution} from '../models/credit';
import {ExpandedExamReturnStatistic} from '../types/types';

type SingleExamReturnState = {
	loading: boolean;
	data: ExpandedExamReturnStatistic[] | null;
	error: Error | null;
	exhaustive: boolean;
};

export type ExamReturnState = {
	[key: string]: {
		[key: string]: SingleExamReturnState;
	};
};

enum ExamReturnActions {
	LOAD_EXAM_RETURN_STATISTIC = 'LOAD_EXAM_RETURN_STATISTIC',
	RECEIVE_EXAM_RETURN_STATISTIC = 'RECEIVE_EXAM_RETURN_STATISTIC',
	RECEIVE_SINGLE_EXAM_RETURN_STATISTIC = 'RECEIVE_SINGLE_EXAM_RETURN_STATISTIC',
	ERROR_RECEIVING_EXAM_RETURN_STATISTIC = 'ERROR_RECEIVING_EXAM_RETURN_STATISTIC',
}

type LoadExamReturnStatistic = {
	type: ExamReturnActions.LOAD_EXAM_RETURN_STATISTIC;
	uni_identifier: string;
	university: Institution;
};

export const loadExamReturnStatistic = (
	uni_identifier: string,
	university: Institution
): LoadExamReturnStatistic => {
	return {
		type: ExamReturnActions.LOAD_EXAM_RETURN_STATISTIC,
		uni_identifier,
		university,
	};
};

type ReceiveExamReturnStatistic = {
	type: ExamReturnActions.RECEIVE_EXAM_RETURN_STATISTIC;
	uni_identifier: string;
	university: Institution;
	examReturn: ExpandedExamReturnStatistic[];
};

export const receiveExamReturnStatistic = (
	uni_identifier: string,
	university: Institution,
	examReturn: ExpandedExamReturnStatistic[]
): ReceiveExamReturnStatistic => {
	return {
		type: ExamReturnActions.RECEIVE_EXAM_RETURN_STATISTIC,
		uni_identifier,
		university,
		examReturn,
	};
};

type ErrorReceivingExamReturnStatistic = {
	type: ExamReturnActions.ERROR_RECEIVING_EXAM_RETURN_STATISTIC;
	uni_identifier: string;
	university: Institution;
	error: Error;
};

export const errorReceivingExamReturnStatistic = (
	uni_identifier: string,
	university: Institution,
	error: Error
): ErrorReceivingExamReturnStatistic => {
	return {
		type: ExamReturnActions.ERROR_RECEIVING_EXAM_RETURN_STATISTIC,
		university,
		uni_identifier,
		error,
	};
};

export type ReceiveSingleExamReturnStatistic = {
	type: ExamReturnActions.RECEIVE_SINGLE_EXAM_RETURN_STATISTIC;
	uni_identifier: string;
	university: Institution;
	examReturn: ExpandedExamReturnStatistic;
};

export const receiveSingleExamReturnStatistic = (
	uni_identifier: string,
	university: Institution,
	examReturn: ExpandedExamReturnStatistic
): ReceiveSingleExamReturnStatistic => {
	return {
		type: ExamReturnActions.RECEIVE_SINGLE_EXAM_RETURN_STATISTIC,
		uni_identifier,
		university,
		examReturn,
	};
};

const initialExamReturnState = {};
export const emptySingleExamReturnState = {
	loading: false,
	data: null,
	error: null,
};

export const examReturnsReducer = (
	state: ExamReturnState = initialExamReturnState,
	action:
		| LoadExamReturnStatistic
		| ReceiveExamReturnStatistic
		| ReceiveSchedulesAction
		| ReceiveSingleExamReturnStatistic
		| ErrorReceivingExamReturnStatistic
): ExamReturnState => {
	switch (action.type) {
		case ExamReturnActions.LOAD_EXAM_RETURN_STATISTIC:
			return {
				...state,
				[action.university]: {
					...state[action.university],
					[action.uni_identifier]: {
						loading: true,
						error: null,
						data: null,
						exhaustive: false,
					},
				},
			};
		case ExamReturnActions.RECEIVE_EXAM_RETURN_STATISTIC:
			return {
				...state,
				[action.university]: {
					...state[action.university],
					[action.uni_identifier]: {
						loading: false,
						error: null,
						data: action.examReturn,
						exhaustive: true,
					},
				},
			};
		case ExamReturnActions.RECEIVE_SINGLE_EXAM_RETURN_STATISTIC:
			return {
				...state,
				[action.university]: {
					...state[action.university],
					[action.uni_identifier]: {
						...state[action.university]?.[action.uni_identifier],
						data: uniqBy(
							[
								...(state[action.university]?.[action.uni_identifier]?.data ??
									[]),
								action.examReturn,
							],
							(u) => u.period
						),
					},
				},
			};
		case ExamReturnActions.ERROR_RECEIVING_EXAM_RETURN_STATISTIC:
			return {
				...state,
				[action.university]: {
					...state[action.university],
					[action.uni_identifier]: {
						loading: false,
						error: action.error,
						data: null,
						exhaustive: false,
					},
				},
			};
		default:
			return state;
	}
};
