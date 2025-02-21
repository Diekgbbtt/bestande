import {ThunkDispatch} from 'redux-thunk';
import {apiRequest, ErrorWithStatusCode} from '../functions/api-request';
import {mapToUniSlug} from '../functions/uni-slug';
import {Institution} from '../models/credit';
import {RoomType} from '../types/schedule';

export const FETCH_ROOM = 'FETCH_ROOM';
export const RECEIVE_ROOM = 'RECEIVE_ROOM';
export const ERROR_RECEIVING_ROOM = 'ERROR_RECEIVING_ROOM';

export type FetchRoom = {
	type: 'FETCH_ROOM';
	identifier: string;
};

const fetchRoomAction = (identifier: string) => {
	return {
		type: FETCH_ROOM,
		identifier,
	};
};

export type ReceiveRoom = {
	type: 'RECEIVE_ROOM';
	identifier: string;
	data: RoomType;
};

const receiveRoom = (identifier: string, data: RoomType): ReceiveRoom => {
	return {
		type: RECEIVE_ROOM,
		identifier,
		data,
	};
};

export type ErrorReceivingRoom = {
	type: 'ERROR_RECEIVING_ROOM';
	identifier: string;
	err: Error;
};

const errorReceivingRoom = (
	identifier: string,
	err: ErrorWithStatusCode
): ErrorReceivingRoom => {
	return {
		type: ERROR_RECEIVING_ROOM,
		identifier,
		err,
	};
};

export const fetchRoom = (institution: Institution, roomId: string) => {
	const identifier = `${institution}/${roomId}`;
	return async (dispatch: ThunkDispatch<{}, {}, any>) => {
		dispatch(fetchRoomAction(identifier));
		try {
			const data = await apiRequest<RoomType>(
				`/institution/${mapToUniSlug(institution)}/room/${roomId}`
			);
			dispatch(receiveRoom(identifier, data));
		} catch (err) {
			dispatch(errorReceivingRoom(identifier, err));
		}
	};
};
