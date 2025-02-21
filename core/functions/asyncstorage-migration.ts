import AsyncStorage from '@react-native-community/async-storage';
import {Store} from './store';

const key = 'migratedFields';

const getMigratedFields = async (): Promise<string[]> => {
	const json = await AsyncStorage.getItem(key);
	if (!json) {
		return [];
	}

	return JSON.parse(json) as string[];
};

const setMigratedFields = (fields: string[]): Promise<void> => {
	return AsyncStorage.setItem(key, JSON.stringify(fields));
};

export const migrateFields = async (fields: string[]) => {
	const alreadyMigratedFields = await getMigratedFields();
	const fieldsToMigrate = fields.filter(
		(field) => !alreadyMigratedFields.includes(field)
	);
	for (const field of fieldsToMigrate) {
		const value = await Store.getString(field);
		console.log(`Migrating field ${field} = ${value}`);
		await AsyncStorage.setItem(field, value ?? '');
	}

	await setMigratedFields([...alreadyMigratedFields, ...fieldsToMigrate]);
};
