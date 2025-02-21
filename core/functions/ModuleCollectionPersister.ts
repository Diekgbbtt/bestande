import AsyncStorage from '@react-native-community/async-storage';
import {CustomModule} from '../models/credit';

const KEY = 'modulecollection';

export const setModuleCollection = (collection: CustomModule[]) => {
	return new Promise<void>((resolve, reject) => {
		AsyncStorage.setItem(KEY, JSON.stringify(collection))
			.then(() => resolve())
			.catch(reject);
	});
};

export const getModuleCollection = (): Promise<CustomModule[]> => {
	return new Promise((resolve, reject) => {
		AsyncStorage.getItem(KEY)
			.then((config) => {
				if (!config) {
					return resolve([]);
				}

				resolve(JSON.parse(config));
			})
			.catch(reject);
	});
};
