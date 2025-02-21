import AsyncStorage from '@react-native-community/async-storage';
import mapKeys from 'lodash/mapKeys';
import {Credit} from '../models/credit';
import {
	COURSE,
	EXAM,
	LECTURE_AND_EXERCISES,
	ModuleType,
} from '../models/module-type';
import {EventSerieWithEventsAndPeople} from '../types/schedule';
import {SerieConfig, SeriesConfigType} from '../types/serie-config';
import {getUniqueIdentifier} from './get-unique-identifier';

const STORAGE_KEY = 'series';

export class SeriesConfig {
	static getDefault(
		series: EventSerieWithEventsAndPeople[]
	): {[key: string]: boolean} {
		const typesAlreadyUsed: ModuleType[] = [];
		const dict: {[key: string]: boolean} = {};
		for (let i = 0; i < series.length; i++) {
			const serie = series[i];
			if (
				!typesAlreadyUsed.includes(serie.category) ||
				serie.category === LECTURE_AND_EXERCISES ||
				serie.category === COURSE ||
				serie.category === EXAM
			) {
				dict[`e-${serie.id}.termine.html`] = true;

				typesAlreadyUsed.push(serie.category);
			} else {
				dict[`e-${serie.id}.termine.html`] = false;
			}
		}

		return dict;
	}

	static get(): Promise<SeriesConfigType> {
		return new Promise((resolve, reject) => {
			AsyncStorage.getItem(STORAGE_KEY)
				.then((config) => {
					if (!config) {
						return resolve({});
					}

					const parsed = JSON.parse(config);
					const mapped = mapKeys(parsed, (value, key) => {
						if (!key.includes('#')) {
							return key;
						}

						return key.substr(0, key.indexOf('#'));
					});
					resolve(mapped);
				})
				.catch(reject);
		});
	}

	static set(config: SeriesConfig) {
		return AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(config));
	}

	static async setSerieConfig(credit: Credit, serieConfig: SerieConfig) {
		const config = await this.get();
		config[getUniqueIdentifier(credit, true)] = serieConfig;
		return this.set(config);
	}

	static serieIsActivated(
		config: SerieConfig,
		serie: EventSerieWithEventsAndPeople
	): boolean {
		return Boolean(config[`e-${serie.id}.termine.html`]);
	}

	static shouldShowWarning(
		config: SerieConfig,
		series: EventSerieWithEventsAndPeople[]
	) {
		if (config) {
			return false;
		}

		const defaultConfig = this.getDefault(series);
		return Object.keys(defaultConfig).filter((v) => !v).length > 0;
	}

	static reset() {
		return AsyncStorage.removeItem(STORAGE_KEY);
	}
}
