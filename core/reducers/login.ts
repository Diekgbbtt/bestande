import {
	DidLogOutAction,
	LoginSuccessAction,
	LOGIN_PROGRESS,
	LOGIN_REQUEST,
	LOGIN_SUCCESS,
	LOGOUT,
	RemoveLoginCredit,
	SetUserNameAction,
	SET_LAST_UPDATE,
	SET_USERNAME,
} from '../actions/login';
import {Institution} from '../models/credit';
import {LoginState} from '../types/login-state';

const initialState: LoginState = {
	loggedIn: false,
	loading: true,
	progress: null,
	username: '',
	error: 'NO_USERNAME',
	lastUpdate: 0,
};

type Actions =
	| LoginSuccessAction
	| SetUserNameAction
	| DidLogOutAction
	| RemoveLoginCredit;

const reducer = function (
	state: LoginState = initialState,
	action: Actions,
	institution: Institution
): LoginState {
	if (
		!action.institution &&
		[
			LOGIN_REQUEST,
			LOGIN_SUCCESS,
			LOGIN_PROGRESS,
			SET_USERNAME,
			LOGOUT,
			SET_LAST_UPDATE,
		].includes(action.type)
	) {
		console.warn(
			'Possible bug: Called login action without institution',
			action
		);
	}

	if (institution && institution !== action.institution) {
		return state;
	}

	switch (action.type) {
		case SET_USERNAME:
			return {
				...state,
				username: action.username,
			};
		case LOGIN_SUCCESS:
			return {
				...state,
				loading: false,
				loggedIn: true,
				progress: null,
				error: null,
			};
		case LOGOUT:
			return {
				...state,
				...initialState,
				loading: false,
			};
		default:
			return state;
	}
};

export const institionReducer = (institution: Institution) => {
	return (state: LoginState, action: Actions) =>
		reducer(state, action, institution);
};
