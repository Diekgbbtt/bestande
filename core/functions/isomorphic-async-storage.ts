import AsyncStorage from '@react-native-community/async-storage';

// Also has a web equivalent in .web.ts
// make sure to align the APIs

export const setAsyncIsomorphic = (
	key: string,
	value: string
): Promise<void> => {
	return AsyncStorage.setItem(key, value);
};

export const getAsyncIsomorphic = (key: string): Promise<string | null> => {
	return AsyncStorage.getItem(key);
};
