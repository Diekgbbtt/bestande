import {
	ErrorReceivingRoom,
	ERROR_RECEIVING_ROOM,
	FetchRoom,
	FETCH_ROOM,
	ReceiveRoom,
	RECEIVE_ROOM,
} from '../actions/room';
import {ErrorWithStatusCode} from '../functions/api-request';
import Room from '../models/room';
import {AppState} from '../types/app-state';
import {RoomType} from '../types/schedule';

type SingleRoomState = {
	loading: boolean;
	data: RoomType | null;
	error: ErrorWithStatusCode | null;
};

const defaultState: SingleRoomState = {
	loading: true,
	data: null,
	error: null,
};

export type RoomState = {[key: string]: SingleRoomState};

export const getRoomState = (state: AppState, identifier: string) => {
	const theState = state.room[identifier] || defaultState;
	if (theState.data) {
		return {
			...theState,
			data: new Room(theState.data),
		};
	}

	return theState;
};

export const room = (
	state: RoomState = {},
	action: FetchRoom | ReceiveRoom | ErrorReceivingRoom
): RoomState => {
	switch (action.type) {
		case FETCH_ROOM:
			return {
				...state,
				[action.identifier]: {
					loading: true,
					data: null,
					error: null,
				},
			};
		case RECEIVE_ROOM:
			return {
				...state,
				[action.identifier]: {
					loading: false,
					data: action.data,
					error: null,
				},
			};
		case ERROR_RECEIVING_ROOM:
			return {
				...state,
				[action.identifier]: {
					loading: false,
					data: null,
					error: action.err,
				},
			};
		default:
			return state;
	}
};
