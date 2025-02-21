import {ThunkDispatch} from 'redux-thunk';
import {apiRequest, ErrorWithStatusCode} from '../functions/api-request';
import {RawPerson} from '../types/schedule';

export const FETCH_PERSON = 'FETCH_PERSON';
export const RECEIVE_PERSON = 'RECEIVE_PERSON';
export const ERROR_RECEIVING_PERSON = 'ERROR_RECEIVING_PERSON';

export type ReceivePerson = {
	type: 'RECEIVE_PERSON';
	identifier: string;
	data: RawPerson;
};
export type ErrorReceivingPerson = {
	type: 'ERROR_RECEIVING_PERSON';
	identifier: string;
	err: ErrorWithStatusCode;
};

const receivePerson = (identifier: string, data: RawPerson): ReceivePerson => {
	return {
		type: RECEIVE_PERSON,
		identifier,
		data,
	};
};

const errorReceivingPerson = (
	identifier: string,
	err: Error
): ErrorReceivingPerson => {
	return {
		type: ERROR_RECEIVING_PERSON,
		identifier,
		err,
	};
};

export type FetchPerson = {
	type: 'FETCH_PERSON';
	identifier: string;
};

const requestPersonFetch = (id: string): FetchPerson => ({
	type: FETCH_PERSON,
	identifier: id,
});

export const fetchPerson = (institution: string, personId: string) => {
	const identifier = `${institution}/${personId}`;
	return async (dispatch: ThunkDispatch<{}, {}, any>) => {
		dispatch(requestPersonFetch(identifier));
		try {
			const data = await apiRequest<RawPerson>(
				`/institution/${institution}/person/${personId}`
			);
			dispatch(receivePerson(identifier, data));
		} catch (err) {
			dispatch(errorReceivingPerson(identifier, err));
		}
	};
};
