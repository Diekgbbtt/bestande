import {NativeModules, Platform} from 'react-native';

const {SharedPreferencesAndroid} = NativeModules;

let UserDefaults: {
	stringForKey: (key: string) => Promise<string | null>;
	setStringForKey: (value: string, key: string) => Promise<string>;
	boolForKey: (key: string) => Promise<boolean>;
	setBoolForKey: (value: boolean, key: string) => Promise<boolean>;
	objectForKey: (key: string) => Promise<any>;
};

if (Platform.OS === 'ios') {
	UserDefaults = require('./user-defaults');
}

export class Store {
	static getString(key: string): Promise<string | null> {
		if (Platform.OS === 'android') {
			return SharedPreferencesAndroid.getString(key);
		}

		if (Platform.OS === 'web') {
			return Promise.resolve(localStorage.getItem(key) ?? null);
		}

		return UserDefaults.stringForKey(key);
	}

	static setString(key: string, value: string): Promise<string> {
		if (Platform.OS === 'android') {
			return SharedPreferencesAndroid.setString(key, value);
		}

		if (Platform.OS === 'web') {
			localStorage.setItem(key, value);
			return Promise.resolve(value);
		}

		return UserDefaults.setStringForKey(value, key);
	}

	static getBool(key: string): Promise<boolean> {
		if (Platform.OS === 'android') {
			return SharedPreferencesAndroid.getBool(key);
		}

		if (Platform.OS === 'web') {
			return Promise.resolve(localStorage.getItem(key) === 'true');
		}

		return UserDefaults.boolForKey(key);
	}

	static setBool(key: string, value: boolean): Promise<boolean> {
		if (Platform.OS === 'android') {
			return SharedPreferencesAndroid.setBool(key, value);
		}

		if (Platform.OS === 'web') {
			localStorage.setItem(key, value ? 'true' : 'false');
			return Promise.resolve(value);
		}

		return UserDefaults.setBoolForKey(value, key);
	}

	static hasKey(key: string): Promise<boolean> {
		if (Platform.OS === 'android') {
			return SharedPreferencesAndroid.hasKey(key);
		}

		if (Platform.OS === 'web') {
			return Promise.resolve(Boolean(localStorage.getItem(key)));
		}

		return new Promise((resolve, reject) => {
			UserDefaults.objectForKey(key)
				.then((value) => {
					resolve(value !== null);
				})
				.catch(reject);
		});
	}
}
