import memoize from 'lodash/memoize';
import md5 from 'md5';
import {Platform} from 'react-native';
import {createSelector} from 'reselect';
import {v4 as uuid} from 'uuid';
import {Institution} from '../models/credit';
import {AppState} from '../types/app-state';
import {LoginState} from '../types/login-state';
import {WebState} from '../types/web-state';

const md5Memoized = memoize(md5);

const getUniqueBrowserId = () => {
	if (!window.localStorage.getItem('uuid')) {
		window.localStorage.setItem('uuid', uuid());
	}

	return window.localStorage.getItem('uuid');
};

export const getUserHash = createSelector(
	[
		(state: AppState | WebState | null, institution: Institution | null) =>
			institution,
		(state: AppState | WebState | null) =>
			state && 'multiLogin' in state ? state?.multiLogin : null,
		(state: AppState | WebState | null) => state?.institution?.institution,
		(state: AppState | WebState | null) => state?.users.uniqueUserId,
	],
	(
		multiLogin: {UZH: LoginState; ETH: LoginState} | null,
		stateInstitution: Institution | null | undefined,
		institution: Institution | null,
		uniqueUserId: string
	): string => {
		const uniqueId =
			Platform.OS === 'web' ? getUniqueBrowserId() : uniqueUserId;
		if (!institution) {
			if (!stateInstitution) {
				return md5Memoized(uniqueId as string);
			}

			institution = stateInstitution;
		}

		if (
			multiLogin?.[institution]?.username &&
			multiLogin[institution].loggedIn
		) {
			return md5Memoized(multiLogin[institution].username);
		}

		return md5Memoized(uniqueId as string);
	}
);
