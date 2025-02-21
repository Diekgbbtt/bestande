import {ThunkDispatch} from 'redux-thunk';

export const GO_ONLINE = 'GO_ONLINE';
export const GO_OFFLINE = 'GO_OFFLINE';

export type GoOnlineAction = {
	type: 'GO_ONLINE';
};

function dispatchOnline(): GoOnlineAction {
	return {
		type: GO_ONLINE,
	};
}

export type GoOfflineAction = {
	type: 'GO_OFFLINE';
};

export function goOffline(): GoOfflineAction {
	return {
		type: GO_OFFLINE,
	};
}

export function goOnline() {
	return (dispatch: ThunkDispatch<{}, {}, any>) => {
		dispatch(dispatchOnline());
	};
}
