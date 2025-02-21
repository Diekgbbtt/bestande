import {CoronaInfo} from '../types/types';

export type CoronaState = {
	data: CoronaInfo | null;
};

enum CoronaActions {
	RECEIVE_CORONA_INFO = 'RECEIVE_CORONA_INFO',
}

type ReceiveCoronaInfo = {
	type: CoronaActions.RECEIVE_CORONA_INFO;
	data: CoronaInfo;
};

export const receiveCoronaInfo = (data: CoronaInfo): ReceiveCoronaInfo => {
	return {
		type: CoronaActions.RECEIVE_CORONA_INFO,
		data,
	};
};

export const coronaReducer = (
	state: CoronaState = {data: null},
	action: ReceiveCoronaInfo
): CoronaState => {
	switch (action.type) {
		case CoronaActions.RECEIVE_CORONA_INFO:
			return {
				...state,
				data: action.data,
			};
		default: {
			return state;
		}
	}
};
