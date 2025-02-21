import AsyncStorage from '@react-native-community/async-storage';

const CLIENT_NONCE_KEY = 'client-nonce';

export const getClientNonce = async () => {
	const value = await AsyncStorage.getItem(CLIENT_NONCE_KEY);
	if (value === null) {
		return 0;
	}

	return Number(value);
};

export const persistClientNonce = (nonce: number) =>
	AsyncStorage.setItem(CLIENT_NONCE_KEY, String(nonce));
