import {
	GoOfflineAction,
	GoOnlineAction,
	GO_OFFLINE,
	GO_ONLINE,
} from '../actions/connectivity';
import {ConnectivityReducerState} from '../types/connectivity-state';

const initialState: ConnectivityReducerState = {
	online: true,
};

export default function connectivityReducer(
	state = initialState,
	action: GoOnlineAction | GoOfflineAction
): ConnectivityReducerState {
	switch (action.type) {
		case GO_ONLINE:
			return {
				...state,
				online: true,
			};
		case GO_OFFLINE:
			return {
				...state,
				online: false,
			};
		default:
			return state;
	}
}
