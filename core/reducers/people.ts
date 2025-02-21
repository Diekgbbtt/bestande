import {
	ErrorReceivingPerson,
	ERROR_RECEIVING_PERSON,
	FetchPerson,
	FETCH_PERSON,
	ReceivePerson,
	RECEIVE_PERSON,
} from '../actions/people';
import {AppState} from '../types/app-state';
import {PeopleState, SinglePersonState} from '../types/people-state';
import {WebState} from '../types/web-state';

const defaultState: SinglePersonState = {
	loading: true,
	data: null,
	error: null,
};

export const getPerson = (
	state: WebState | AppState,
	identifier: string
): SinglePersonState => {
	const theState = state.people[identifier] || defaultState;
	return theState;
};

export const people = (
	state: PeopleState = {},
	action: FetchPerson | ReceivePerson | ErrorReceivingPerson
): PeopleState => {
	switch (action.type) {
		case FETCH_PERSON:
			return {
				...state,
				[action.identifier]: {
					loading: true,
					data: null,
					error: null,
				},
			};
		case RECEIVE_PERSON:
			return {
				...state,
				[action.identifier]: {
					loading: false,
					data: action.data,
					error: null,
				},
			};
		case ERROR_RECEIVING_PERSON:
			return {
				...state,
				[action.identifier]: {
					loading: false,
					data: null,
					error: {
						statusCode: action.err.statusCode,
						message: action.err.message,
						name: 'RequestError',
					},
				},
			};
		default:
			return state;
	}
};
