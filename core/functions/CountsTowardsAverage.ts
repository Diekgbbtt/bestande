import AsyncStorage from '@react-native-community/async-storage';
import mapKeys from 'lodash/mapKeys';
import {Credit, UntypedGrade} from '../models/credit';
import {CountsTowardsAverageMap} from '../types/counts-towards-average-state';
import {canCountTowardsAverage} from './can-count-towards-average';
import {shouldCountTowardsAverage} from './does-count-towards-average';
import {getUniqueIdentifier} from './get-unique-identifier';
import {Store} from './store';

export class CountsTowardsAverage {
	static setMap(map: CountsTowardsAverageMap) {
		return new Promise<void>((resolve, reject) => {
			AsyncStorage.setItem('counts-towards-average', JSON.stringify(map))
				.then(() => resolve())
				.catch((err) => reject(err));
		});
	}

	static getMap(): Promise<CountsTowardsAverageMap | null> {
		return new Promise((resolve, reject) => {
			AsyncStorage.getItem('counts-towards-average')
				.then((map) => {
					if (map) {
						const parsed = JSON.parse(map);
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

	static set(credit: Credit, value: boolean) {
		return new Promise((resolve, reject) => {
			if (!canCountTowardsAverage(credit)) {
				resolve(false);
				return;
			}

			const newKey = this.makeKey(credit);
			Store.setBool(newKey, value)
				.then(() => {
					resolve(true);
				})
				.catch(reject);
		});
	}

	static async get(credit: Credit) {
		if (!canCountTowardsAverage(credit)) {
			return false;
		}

		const hasPreference = await this.hasUserPreference(credit);
		if (hasPreference) {
			return this.userPreference(credit);
		}

		return shouldCountTowardsAverage(credit);
	}

	static makeKey(credit: Credit) {
		return `counts-${getUniqueIdentifier(credit, true)}`;
	}

	static userPreference(credit: Credit): Promise<boolean> {
		return Store.getBool(this.makeKey(credit));
	}

	static hasUserPreference(credit: Credit): Promise<boolean> {
		return Store.hasKey(this.makeKey(credit));
	}

	static parseGrade(grade: UntypedGrade): number | null {
		if (!grade) {
			return null;
		}

		if (grade === 'BEST') {
			return 6;
		}

		if (grade === 'Best') {
			return 6;
		}

		if (grade === 'NB') {
			return 1;
		}

		if (grade === 'Abbr') {
			return 1;
		}

		if (grade === 'N.BE') {
			return 1;
		}

		if (grade === 'N. BE') {
			return 1;
		}

		return parseFloat(String(grade));
	}
}
