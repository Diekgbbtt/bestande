import AsyncStorage from '@react-native-community/async-storage';
import {
	getInitialGradeStatisticLastUploadedHashState,
	GradeStatisticLastUploadedHashState,
} from './reducer';

const storageKey = 'grade-statistic-last-uploaded-hash';
const optedKey = 'grade-statistic-opted-in';

export const persistGradeStatisticLastUploadedHashState = (
	state: GradeStatisticLastUploadedHashState
) => {
	return AsyncStorage.setItem(storageKey, JSON.stringify(state));
};

export const loadGradeStatisticLastUploadedHashState = async (): Promise<GradeStatisticLastUploadedHashState> => {
	const str = await AsyncStorage.getItem(storageKey);
	return {
		...getInitialGradeStatisticLastUploadedHashState(),
		...(str ? JSON.parse(str) : {}),
	};
};

export const persistOptedInSetting = async (optedIn: boolean) => {
	return AsyncStorage.setItem(optedKey, String(optedIn));
};

export const getOptedInSetting = async (): Promise<boolean> => {
	const setting = await AsyncStorage.getItem(optedKey);
	return setting !== 'false';
};
