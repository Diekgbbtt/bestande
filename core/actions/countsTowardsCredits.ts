import {CountsTowardsCredits} from '../functions/CountsTowardsCredits';
import {Credit} from '../models/credit';

export const SET_COUNTS_CREDITS_MAP = 'SET_COUNTS_CREDITS_MAP';
export const SET_MODULE_COUNTS_TOWARDS_CREDIT =
	'SET_MODULE_COUNTS_TOWARDS_CREDIT';

export type CountsTowardsCreditsMap = {[key: string]: boolean};

export type SetCountsTowardsCreditsMapAction = {
	type: 'SET_COUNTS_CREDITS_MAP';
	map: CountsTowardsCreditsMap | null;
};

export type SetModuleCountsTowardsCreditAction = {
	type: 'SET_MODULE_COUNTS_TOWARDS_CREDIT';
	module: Credit;
	counts: boolean;
};

export function setCountsTowardsCreditsMap(
	map: CountsTowardsCreditsMap | null
): SetCountsTowardsCreditsMapAction {
	return {
		type: SET_COUNTS_CREDITS_MAP,
		map,
	};
}

function setModuleCountsTowardsCredit(
	module: Credit,
	counts: boolean
): SetModuleCountsTowardsCreditAction {
	return {
		type: SET_MODULE_COUNTS_TOWARDS_CREDIT,
		module,
		counts,
	};
}

export function changeModuleCountsTowardsCredits(
	module: Credit,
	counts: boolean
) {
	return async (dispatch) => {
		await CountsTowardsCredits.set(module, counts);
		dispatch(setModuleCountsTowardsCredit(module, counts));
	};
}
