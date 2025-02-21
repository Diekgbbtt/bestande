import AsyncStorage from '@react-native-community/async-storage';
import {CustomCredit} from '../reducers/customCredits';
import {AppearanceSetting} from '../types/appearance-state';
import {LastReadTimestampReducerType} from '../types/chat';

const lastReadTimestampPersistanceKey = 'lastReadTimestampt';

export const persistLastReadTimestamps = (
	timestampsState: LastReadTimestampReducerType
): Promise<void> => {
	return AsyncStorage.setItem(
		lastReadTimestampPersistanceKey,
		JSON.stringify(timestampsState)
	);
};

export const readLastReadTimestamps = async (): Promise<LastReadTimestampReducerType> => {
	const str = await AsyncStorage.getItem(lastReadTimestampPersistanceKey);
	if (!str) {
		return {};
	}

	const result = JSON.parse(str) as LastReadTimestampReducerType;
	return result;
};

const appearancePersistanceKey = 'appearancePersistanceKey';
export const persistPreferredAppearance = (
	appearanceSetting: AppearanceSetting
): Promise<void> => {
	return AsyncStorage.setItem(appearancePersistanceKey, appearanceSetting);
};

export const readPreferredAppearance = async (): Promise<AppearanceSetting> => {
	const appearance = await AsyncStorage.getItem(appearancePersistanceKey);
	if (!appearance) {
		return 'auto';
	}

	return appearance as AppearanceSetting;
};

const typedAndUnsentKey = 'typedAndUnsent';
export const persistTypedAndUnsentKey = (typedAndUnsent: {
	[key: string]: string;
}) => {
	return AsyncStorage.setItem(
		typedAndUnsentKey,
		JSON.stringify(typedAndUnsent)
	);
};

export const readTypedAndUnsentKey = async (): Promise<{
	[key: string]: string;
}> => {
	const typedAndUnsentJSON = await AsyncStorage.getItem(typedAndUnsentKey);
	return typedAndUnsentJSON ? JSON.parse(typedAndUnsentJSON) : {};
};

const customCreditsKey = 'customCredits';
export const persistCustomCredits = (credits: CustomCredit[]) => {
	return AsyncStorage.setItem(customCreditsKey, JSON.stringify(credits));
};

export const readCustomCredits = async (): Promise<CustomCredit[]> => {
	const customCreditsJSON = await AsyncStorage.getItem(customCreditsKey);
	return customCreditsJSON ? JSON.parse(customCreditsJSON) : [];
};
