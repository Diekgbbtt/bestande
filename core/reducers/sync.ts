import {SetOverrideAction, SET_OVERRIDE} from './creditOverrides';
import {
	AddModules,
	ADD_MODULES,
	RemoveModule,
	REMOVE_MODULE,
} from './moduleCollection';

enum SyncActions {
	SET_CLIENT_NONCE = 'SET_CLIENT_NONCE',
	SET_SERVER_NONCE = 'SET_SERVER_NONCE',
}

export type SyncState = {
	serverNonce: number | null;
	clientNonce: number | null;
};

type SetServerNonce = {
	type: SyncActions.SET_SERVER_NONCE;
	newNonce: number;
};

export const setServerNonce = (newNonce: number): SetServerNonce => {
	return {
		type: SyncActions.SET_SERVER_NONCE,
		newNonce,
	};
};

type SetClientNonce = {
	type: SyncActions.SET_CLIENT_NONCE;
	newNonce: number;
};

export const setClientNonce = (newNonce: number): SetClientNonce => {
	return {
		type: SyncActions.SET_CLIENT_NONCE,
		newNonce,
	};
};

export const syncReducer = (
	state: SyncState = {
		serverNonce: null,
		clientNonce: null,
	},
	action:
		| SetServerNonce
		| SetClientNonce
		| AddModules
		| RemoveModule
		| SetOverrideAction
): SyncState => {
	switch (action.type) {
		case REMOVE_MODULE:
		case ADD_MODULES:
			if (state.clientNonce === null) {
				throw new Error('client nonce expected to not be null');
			}

			return {
				...state,
				clientNonce: state.clientNonce + 1,
			};
		case SET_OVERRIDE:
			return {
				...state,
				clientNonce:
					(state.clientNonce ?? 0) + (action.source === 'local' ? 1 : 0),
			};
		case SyncActions.SET_CLIENT_NONCE:
			return {
				...state,
				clientNonce: action.newNonce,
			};
		case SyncActions.SET_SERVER_NONCE:
			return {
				...state,
				serverNonce: action.newNonce,
			};
		default:
			return state;
	}
};
