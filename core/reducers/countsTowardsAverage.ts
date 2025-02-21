import {
	SetCountsTowardsAverageAction,
	SetCountsTowardsAverageMapAction,
	SET_COUNTS_MAP,
	SET_MODULE_AVG,
} from '../actions/countsTowardsAverage';
import {getUniqueIdentifier} from '../functions/get-unique-identifier';
import {CountsTowardsAverageState} from '../types/counts-towards-average-state';

const initialState: CountsTowardsAverageState = {};

type Actions = SetCountsTowardsAverageAction | SetCountsTowardsAverageMapAction;

export default function countsTowardsAverage(
	state: CountsTowardsAverageState = initialState,
	action: Actions
): CountsTowardsAverageState {
	switch (action.type) {
		case SET_COUNTS_MAP:
			return {
				...state,
				...action.map,
			};
		case SET_MODULE_AVG:
			return {
				...state,
				[getUniqueIdentifier(action.module, true)]: action.counts,
			};
		default:
			return state;
	}
}
