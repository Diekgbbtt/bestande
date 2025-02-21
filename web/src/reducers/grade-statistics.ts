import {mapToUniSlug} from '../../../core/functions/uni-slug';
import Module from '../../../core/models/module';
import {ApiResponse} from '../../../core/reducers/api';
import {GradeStatisticsState} from '../../../core/types/grade-statistics';
import {
	GradeModuleError,
	GradeModuleRequest,
	GradeModuleResponse,
	STATISTIC_MODULE_ERROR,
	STATISTIC_MODULE_REQUEST,
	STATISTIC_MODULE_RESPONSE,
} from '../actions/grade-statistics';

const initialState = {};

const initialGradeState = {
	loading: true,
	stats: null,
	error: null,
};

type Action = GradeModuleRequest | GradeModuleResponse | GradeModuleError;

export const makeKey = (action: Action | Module | ApiResponse) => {
	// @ts-expect-error
	return `${mapToUniSlug(action.university || action.institution)}/${
		// @ts-expect-error
		action.moduleid || action.uni_identifier
	}`;
};

export default function gradeStatistics(
	state: GradeStatisticsState = initialState,
	action: Action
): GradeStatisticsState {
	switch (action.type) {
		case STATISTIC_MODULE_REQUEST:
			return {
				...state,
				[makeKey(action)]: initialGradeState,
			};
		case STATISTIC_MODULE_RESPONSE:
			return {
				...state,
				[makeKey(action)]: {
					loading: false,
					stats: action.stats,
					error: null,
				},
			};
		case STATISTIC_MODULE_ERROR:
			return {
				...state,
				[makeKey(action)]: {
					loading: false,
					stats: null,
					error: action.error,
				},
			};
		default:
			return state;
	}
}
