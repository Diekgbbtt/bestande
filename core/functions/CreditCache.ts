import AsyncStorage from '@react-native-community/async-storage';
import {Institution} from '../models/credit';
import {UZH} from '../models/university';
import {UzhLoginResponse} from '../types/uzh-login';

class ResponseValidator {
	static isValid(json: UzhLoginResponse): boolean {
		if (!json || !json.version || json.version < 6) {
			return false;
		}

		return true;
	}
}

export const cacheKey = (institution: Institution): string => {
	if (institution !== UZH) {
		return `${institution.toLowerCase()}_creditCache`;
	}

	return 'creditCache';
};

export class CreditCache {
	static store(institution: Institution, creditResponse: any) {
		return AsyncStorage.setItem(
			cacheKey(institution),
			JSON.stringify(creditResponse)
		);
	}

	static get(institution: Institution): Promise<UzhLoginResponse | null> {
		return new Promise((resolve, reject) => {
			AsyncStorage.getItem(cacheKey(institution))
				.then((response) => {
					if (!response || response === '') {
						resolve(null);
					} else {
						const parsed = JSON.parse(response);
						if (!ResponseValidator.isValid(parsed)) {
							return resolve(null);
						}

						resolve(parsed);
					}
				})
				.catch((err) => reject(err));
		});
	}

	static clear(institution: Institution) {
		return AsyncStorage.setItem(cacheKey(institution), '');
	}
}
