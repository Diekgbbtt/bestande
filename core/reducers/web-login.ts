import {LOGIN, LoginAction} from '../actions/login';
import {WebUser} from '../types/ratings';

export type WebLoginState = WebUser | null;

export const login = (
	state: WebLoginState = null,
	action: LoginAction
): WebLoginState => {
	switch (action.type) {
		case LOGIN:
			return action.user;
		default:
			return state;
	}
};
