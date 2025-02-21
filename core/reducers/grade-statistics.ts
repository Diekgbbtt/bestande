import {
	GradeStatisticRequestAction,
	GradeStatisticResponseAction,
	GradeStatisticsErrorAction,
	STATISTIC_MODULE_ERROR,
	STATISTIC_MODULE_REQUEST,
	STATISTIC_MODULE_RESPONSE,
} from '../actions/grade-statistics';
import {Institution} from '../models/credit';
import {GradeStatisticsReducerType} from '../types/grade-statistics';

const initialState = {};

export const initialGradeState = {
	loading: true,
	stats: null,
	error: null,
};

type Actions =
	| GradeStatisticRequestAction
	| GradeStatisticResponseAction
	| GradeStatisticsErrorAction;

function gradeStatistics(
	state: GradeStatisticsReducerType = initialState,
	action: Actions,
	institution: Institution
): GradeStatisticsReducerType {
	if (institution && institution !== action.institution) {
		return state;
	}

	switch (action.type) {
		case STATISTIC_MODULE_REQUEST:
			return {
				...state,
				[action.moduleid]: initialGradeState,
			};
		case STATISTIC_MODULE_RESPONSE:
			return {
				...state,
				[action.moduleid]: {
					loading: false,
					stats: action.stats,
					error: null,
				},
			};
		case STATISTIC_MODULE_ERROR:
			return {
				...state,
				[action.moduleid]: {
					loading: false,
					stats: null,
					error: action.error,
				},
			};
		default:
			return state;
	}
}

export const instititionReducer = (institution: Institution) => {
	return (state: GradeStatisticsReducerType, action: Actions) => {
		return gradeStatistics(state, action, institution);
	};
};
