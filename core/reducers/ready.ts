import {
	SetCountsTowardsCreditsMapAction,
	SET_COUNTS_CREDITS_MAP,
} from '../actions/countsTowardsCredits';
import {SetReady} from '../actions/login';
import {ReadyState} from '../types/ready-state';

export const SET_READY = 'SET_READY';

const readyState: ReadyState = {
	app: false,
	header: false,
};

export const ready = (
	state: ReadyState = readyState,
	action: SetReady | SetCountsTowardsCreditsMapAction
) => {
	switch (action.type) {
		case SET_READY:
			return {
				...state,
				app: true,
			};
		case SET_COUNTS_CREDITS_MAP:
			return {
				...state,
				header: true,
			};
		default:
			return state;
	}
};
