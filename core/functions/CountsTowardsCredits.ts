import AsyncStorage from '@react-native-community/async-storage';
import mapKeys from 'lodash/mapKeys';
import {CountsTowardsCreditsMap} from '../actions/countsTowardsCredits';
import {Credit} from '../models/credit';
import {shouldCountTowardsCredit} from './does-count-towards-credit';
import {getUniqueIdentifier} from './get-unique-identifier';
import {Store} from './store';

export class CountsTowardsCredits {
	static setMap(map: CountsTowardsCreditsMap) {
		return AsyncStorage.setItem('counts-towards-credits', JSON.stringify(map));
	}

	static getMap(): Promise<CountsTowardsCreditsMap | null> {
		return new Promise((resolve, reject) => {
			AsyncStorage.getItem('counts-towards-credits')
				.then((map) => {
					if (map) {
						const parsed: CountsTowardsCreditsMap = JSON.parse(map);
						const mapped = mapKeys(parsed, (value, key) => {
							if (!key.includes('#')) {
								return key;
							}

							return key.substr(0, key.indexOf('#'));
						});
						resolve(mapped);
					} else {
						resolve(null);
					}
				})
				.catch((err) => reject(err));
		});
	}

	static set(module: Credit, value: boolean) {
		const key = this.makeKey(module);
		return Store.setBool(key, value);
	}

	static async get(module: Credit) {
		const hasPreference = await this.hasUserPreference(module);
		if (hasPreference) {
			return this.userPreference(module);
		}

			return shouldCountTowardsCredit(module);
	}

	static userPreference(module: Credit) {
		return Store.getBool(this.makeKey(module));
	}

	static hasUserPreference(module: Credit) {
		return Store.hasKey(this.makeKey(module));
	}

	static makeKey(credit: Credit) {
		return `counts-credits-${getUniqueIdentifier(credit, true)}`;
	}
}
