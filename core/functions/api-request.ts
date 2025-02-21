import {DOMAIN} from '../models/domain';
import {isNative} from './is-native';

const getDomain = () => {
	if (typeof process !== 'undefined' && process.env && process.env.DOMAIN) {
		return process.env.DOMAIN + '/api';
	}

	if (isNative) {
		return DOMAIN;
	}

	return DOMAIN;
};

export interface ErrorWithStatusCode extends Error {
	statusCode?: number;
}

export const apiRequest = async <T>(
	url: string,
	options: RequestInit = {}
): Promise<T> => {
	const apiEndpoint = getDomain();
	const response = await fetch(apiEndpoint + url, {
		...options,
		headers: {
			...(options.headers || {}),
			'content-type': 'application/json',
		},
		credentials: 'include',
	});

	const json = await response.json();
	if (json.success) {
		if (Object.prototype.hasOwnProperty.call(json, 'data')) {
			return json.data;
		}

		return json;
	}

	const error: ErrorWithStatusCode = new Error(json.error);
	error.statusCode = response.status;
	throw error;
};
