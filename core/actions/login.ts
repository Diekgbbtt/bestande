import {Credit, Institution} from '../models/credit';
import {UzhLoginResponse} from '../types/uzh-login';

export const SET_USERNAME = 'SET_USERNAME';
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_PROGRESS = 'LOGIN_PROGRESS';
export const LOGOUT = 'LOGOUT';
export const SET_LAST_UPDATE = 'SET_LAST_UPDATE';
export const REMOVE_LOGIN_CREDIT = 'REMOVE_LOGIN_CREDIT';

export type SetReady = {
	type: 'SET_READY';
};

export type SetUserNameAction = {
	type: 'SET_USERNAME';
	username: string;
	institution: Institution;
};

export function setUsername(
	username: string,
	institution: Institution
): SetUserNameAction {
	return {
		type: SET_USERNAME,
		username,
		institution,
	};
}

export type LoginSuccessAction = {
	type: 'LOGIN_SUCCESS';
	response: UzhLoginResponse;
	institution: Institution;
};

export function loginSuccessEvent(
	response: UzhLoginResponse,
	institution: Institution
): LoginSuccessAction {
	return {
		type: LOGIN_SUCCESS,
		response,
		institution,
	};
}

export type RemoveLoginCredit = {
	type: 'REMOVE_LOGIN_CREDIT';
	credit: Credit;
	institution: Institution;
};

export const removeLoginCredit = (
	credit: Credit,
	institution: Institution
): RemoveLoginCredit => {
	return {
		type: REMOVE_LOGIN_CREDIT,
		credit,
		institution,
	};
};

export type DidLogOutAction = {
	type: 'LOGOUT';
	institution: Institution;
};

export function didLogOut(institution: Institution): DidLogOutAction {
	return {
		type: LOGOUT,
		institution,
	};
}

//  Web login
export const LOGIN = 'LOGIN';

export type LoginAction = {
	type: 'LOGIN';
	user: any;
};

export const doLogin = (user: any): LoginAction => {
	return {
		type: LOGIN,
		user,
	};
};
