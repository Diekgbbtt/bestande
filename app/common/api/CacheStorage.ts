import AsyncStorage from '@react-native-community/async-storage';

// Inspired by lscache https://github.com/pamelafox/lscache

const CACHE_PREFIX = 'cachestore-';
const CACHE_EXPIRATION_PREFIX = 'cacheexpiration-';
const EXPIRY_UNITS = 60 * 1000; // Time resolution in minutes

function currentTime() {
	return Math.floor(new Date().getTime() / EXPIRY_UNITS);
}

export const CacheStore = {
	async get(key: string) {
		const theKey = CACHE_PREFIX + key;
		const exprKey = CACHE_EXPIRATION_PREFIX + key;
		const expiry = await AsyncStorage.getItem(exprKey);
		if (expiry && currentTime() >= parseInt(expiry, 10)) {
			await AsyncStorage.multiRemove([exprKey, theKey]);
			return null;
		}

		const item = await AsyncStorage.getItem(theKey);
		if (!item) {
			return null;
		}

		return JSON.parse(item);
	},

	async set(key: string, value: any, time: number) {
		const theKey = CACHE_PREFIX + key;
		const exprKey = CACHE_EXPIRATION_PREFIX + key;
		if (time) {
			await AsyncStorage.setItem(exprKey, (currentTime() + time).toString());
			return AsyncStorage.setItem(theKey, JSON.stringify(value));
		}

		await AsyncStorage.removeItem(exprKey);
		return AsyncStorage.setItem(theKey, JSON.stringify(value));
	},

	remove(key: string) {
		return AsyncStorage.multiRemove([
			CACHE_EXPIRATION_PREFIX + key,
			CACHE_PREFIX + key,
		]);
	},

	async isExpired(key: string) {
		const exprKey = CACHE_EXPIRATION_PREFIX + key;
		const expiry = await AsyncStorage.getItem(exprKey);
		const expired = expiry && currentTime() >= parseInt(expiry, 10);
		return expired ? Promise.resolve() : Promise.reject(null); // eslint-disable-line prefer-promise-reject-errors
	},

	async flush() {
		const keys = await AsyncStorage.getAllKeys();
		const theKeys = keys.filter((key) => {
			return (
				key.startsWith(CACHE_PREFIX) || key.startsWith(CACHE_EXPIRATION_PREFIX)
			);
		});
		return AsyncStorage.multiRemove(theKeys);
	},

	async flushExpired() {
		const keys = await AsyncStorage.getAllKeys();
		keys.forEach((key) => {
			if (key.startsWith(CACHE_EXPIRATION_PREFIX)) {
				const exprKey = key;
				return AsyncStorage.getItem(exprKey).then((expiry) => {
					if (expiry && currentTime() >= parseInt(expiry, 10)) {
						const theKey =
							CACHE_PREFIX + key.replace(CACHE_EXPIRATION_PREFIX, '');
						return AsyncStorage.multiRemove([exprKey, theKey]);
					}
				});
			}
		});
	},
};

// Always flush expired items on start time
CacheStore.flushExpired()
	.then(() => {
		// 	console.log('Flushed cache');
	})
	.catch((err) => {
		console.log('Could not flush cache', err);
	});
