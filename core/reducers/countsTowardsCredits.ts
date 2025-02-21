import {
	CountsTowardsCreditsMap,
	SetCountsTowardsCreditsMapAction,
	SetModuleCountsTowardsCreditAction,
	SET_COUNTS_CREDITS_MAP,
	SET_MODULE_COUNTS_TOWARDS_CREDIT,
} from '../actions/countsTowardsCredits';
import {getUniqueIdentifier} from '../functions/get-unique-identifier';

export type CountsTowardsCreditsState = CountsTowardsCreditsMap;

const initialState: CountsTowardsCreditsState = {};

type Actions =
	| SetCountsTowardsCreditsMapAction
	| SetModuleCountsTowardsCreditAction;

export default function countsTowardsCredits(
	state = initialState,
	action: Actions
) {
	switch (action.type) {
		case SET_COUNTS_CREDITS_MAP:
			return {
				...state,
				...action.map,
			};
		case SET_MODULE_COUNTS_TOWARDS_CREDIT:
			return {
				...state,
				[getUniqueIdentifier(action.module, true)]: action.counts,
			};
		default:
			return state;
	}
}
