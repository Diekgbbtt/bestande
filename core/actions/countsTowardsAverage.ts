import {AnyAction, Dispatch} from 'redux';
import {CountsTowardsAverage} from '../functions/CountsTowardsAverage';
import {Credit} from '../models/credit';
import {CountsTowardsAverageMap} from '../types/counts-towards-average-state';

export const SET_COUNTS_MAP = 'SET_COUNTS_MAP';
export const SET_MODULE_AVG = 'SET_MODULE_AVG';

export type SetCountsTowardsAverageMapAction = {
	type: 'SET_COUNTS_MAP';
	map: CountsTowardsAverageMap | null;
};

export type SetCountsTowardsAverageAction = {
	type: 'SET_MODULE_AVG';
	module: Credit;
	counts: boolean;
};

export function setCountsTowardsAverageMap(
	map: CountsTowardsAverageMap | null
): SetCountsTowardsAverageMapAction {
	return {
		type: SET_COUNTS_MAP,
		map,
	};
}

function setModuleCountsTowardsAverage(
	module: Credit,
	counts: boolean
): SetCountsTowardsAverageAction {
	return {
		type: SET_MODULE_AVG,
		module,
		counts,
	};
}

export function changeModuleCountsTowardsAverage(
	module: Credit,
	counts: boolean
) {
	return async (dispatch: Dispatch<AnyAction>) => {
		await CountsTowardsAverage.set(module, counts);
		dispatch(setModuleCountsTowardsAverage(module, counts));
	};
}
