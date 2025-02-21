import {AppLanguage} from './app-language';

export type FoodTag = {
	key: FoodTagKey;
	label: {[key in AppLanguage]: string};
};

export type FoodTagKey =
	| 'mensa'
	| 'bar'
	| 'snack'
	| 'street-food'
	| 'coffee'
	| 'dinner'
	| 'restaurant';

export const mensa: FoodTag = {
	key: 'mensa',
	label: {
		de: 'Mensa',
		en: 'Canteen',
	},
};

export const snack: FoodTag = {
	key: 'snack',
	label: {
		de: 'Snack',
		en: 'Snack',
	},
};

export const streetfood: FoodTag = {
	key: 'street-food',
	label: {
		de: 'Street Food',
		en: 'Street Food',
	},
};

export const coffee: FoodTag = {
	key: 'coffee',
	label: {
		de: 'Kaffee',
		en: 'Coffee',
	},
};

export const dinner: FoodTag = {
	key: 'dinner',
	label: {
		de: 'Abendessen',
		en: 'Dinner',
	},
};

export const restaurant: FoodTag = {
	key: 'restaurant',
	label: {
		de: 'Restaurant',
		en: 'Restaurant',
	},
};
