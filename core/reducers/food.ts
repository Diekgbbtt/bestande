import {ThunkDispatch} from 'redux-thunk';
import ethMensa from '../data/eth-mensa';
import {mensaMensaList} from '../data/mensa-mensa-list';
import unifiedMensa from '../data/unified-mensa';
import uzhMensa, {Mensa, MensaDay, MensaId} from '../data/uzh-mensa';
import {apiRequest, ErrorWithStatusCode} from '../functions/api-request';
import {getInitialDay, getMensaKey} from '../functions/mensa-helpers';
import {mapToUniSlug} from '../functions/uni-slug';
import {Allergen} from '../models/allergens';
import {AppLanguage} from '../models/app-language';
import {Institution} from '../models/credit';
import {FoodTagKey} from '../models/food-tags';
import {ETH, UZH} from '../models/university';
import {
	ApiFoodResponseWrapped,
	AppFoodState,
	FoodApiResponse,
	NutritionFilterValue,
	PricingSetting,
} from '../types/food';

export const CHANGE_MENSA = 'CHANGE_MENSA';
const LOAD_MENSA = 'LOAD_MENSA';
const RECEIVE_MENSA = 'RECEIVE_MENSA';
const ERROR_RECEIVING_MENSA = 'ERROR_RECEIVING_MENSA';
const CHANGE_DAY = 'CHANGE_DAY';
export const CHANGE_PRICING = 'CHANGE_PRICING';
export const TURN_ON_FILTER = 'TURN_ON_FILTER';
export const TURN_OFF_FILTER = 'TURN_OFF_FILTER';
const SET_ALL_FILTERS = 'SET_ALL_FILTERS';
const NOOP = 'NOOP';
const CHANGE_PRICE_FILTER = 'CHANGE_PRICE_FILTER';
const SET_NOW_OPEN_FILTER = 'SET_NOW_OPEN_FILTER';
export const SET_NUTRITION = 'SET_NUTRITION';
export const SET_ALLERGEN_FILTER = 'SET_ALLERGEN_FILTER';
const CHANGE_ENERGY_FILTER = 'CHANGE_ENERGY_FILTER';
export const SET_SHOW_CALORIES = 'SET_SHOW_CALORIES';

export const allMensa = mensaMensaList();

export const retiredCanteens = [
	'plattenstrasse',
	'center',
	'zzm',
	'tierspital',
	'botgarten',
	'main-building',
	'eth-main-building',
];

const initialState: AppFoodState = {
	mensa: allMensa[0].id,
	day: getInitialDay(),
	plans: {
		/*
			'main-building-montag': ...
		*/
	},
	pricing: 'student',
	filters: {},
	nowOpenFilter: false,
	priceRange: [1, 20],
	nutrition: 'all',
	energyRange: [0, 2000],
	allergenFilter: [],
	showCalories: true,
};

export const allMensaForInstitution = (
	institution: Institution
): {institution: Institution | null; mensa: Mensa[]}[] => {
	const mensi =
		institution === UZH
			? [
					{institution: null, mensa: unifiedMensa},
					{institution: UZH, mensa: uzhMensa},
					{institution: ETH, mensa: ethMensa},
			  ]
			: [
					{institution: null, mensa: unifiedMensa},
					{institution: ETH, mensa: ethMensa},
					{institution: UZH, mensa: uzhMensa},
			  ];

	return mensi;
};

type Noop = {
	type: 'NOOP';
};

type ChangeMensa = {
	type: 'CHANGE_MENSA';
	mensa: MensaId;
};

export const changeMensa = (mensa: MensaId): ChangeMensa | Noop => {
	if (!allMensa.find((m) => mensa === m.id)) {
		return {
			type: NOOP,
		};
	}

	return {
		type: CHANGE_MENSA,
		mensa,
	};
};

export type ChangeDay = {
	type: 'CHANGE_DAY';
	day: MensaDay;
};

export const changeDay = (day: MensaDay): ChangeDay => {
	return {
		type: CHANGE_DAY,
		day,
	};
};

type TurnOnFilter = {
	type: 'TURN_ON_FILTER';
	filter: FoodTagKey;
};

export const turnOnFilter = (filter: FoodTagKey): TurnOnFilter => {
	return {
		type: TURN_ON_FILTER,
		filter,
	};
};

type TurnOffFilter = {
	type: 'TURN_OFF_FILTER';
	filter: FoodTagKey;
};

export const turnOffFilter = (filter: FoodTagKey): TurnOffFilter => {
	return {
		type: TURN_OFF_FILTER,
		filter,
	};
};

type SetAllFilters = {
	type: 'SET_ALL_FILTERS';
	filters: {[key in FoodTagKey]: boolean};
};

export const setAllFilters = (
	filters: {[key in FoodTagKey]: boolean}
): SetAllFilters => {
	return {
		type: SET_ALL_FILTERS,
		filters,
	};
};

type ChangePricing = {
	type: 'CHANGE_PRICING';
	pricing: PricingSetting;
};

export const changePricingAction = (
	pricing: PricingSetting
): ChangePricing => ({
	type: CHANGE_PRICING,
	pricing,
});

export const changePricing = (pricing: PricingSetting) => {
	return async (dispatch: ThunkDispatch<{}, {}, any>) => {
		dispatch(changePricingAction(pricing));
	};
};

type ChangePriceRange = {
	type: 'CHANGE_PRICE_FILTER';
	priceRange: [number, number];
};

export const changePriceRange = (
	priceRange: [number, number]
): ChangePriceRange => {
	return {
		type: CHANGE_PRICE_FILTER,
		priceRange,
	};
};

type ChangeEnergyFilter = {
	type: 'CHANGE_ENERGY_FILTER';
	energyRange: [number, number];
};

export const changeEnergyRange = (
	energyRange: [number, number]
): ChangeEnergyFilter => {
	return {
		type: CHANGE_ENERGY_FILTER,
		energyRange,
	};
};

type SetNowOpenFilter = {
	type: 'SET_NOW_OPEN_FILTER';
	isNowOpen: boolean;
};

export const setNowOpen = (isNowOpen: boolean): SetNowOpenFilter => {
	return {
		type: SET_NOW_OPEN_FILTER,
		isNowOpen,
	};
};

type SetNutritonFilter = {
	type: 'SET_NUTRITION';
	nutrition: NutritionFilterValue;
};

export const setNutrition = (
	nutrition: NutritionFilterValue
): SetNutritonFilter => {
	return {
		type: SET_NUTRITION,
		nutrition,
	};
};

type SetAllergenFilter = {
	type: 'SET_ALLERGEN_FILTER';
	allergenFilter: Allergen[];
};

export const setAllergenFilter = (allergenFilter: Allergen[]) => {
	return {
		type: SET_ALLERGEN_FILTER,
		allergenFilter,
	};
};

type LoadMensa = {
	type: 'LOAD_MENSA';
	mensa: MensaId;
	day: MensaDay;
};

const loadMensaAction = (mensa: MensaId, day: MensaDay): LoadMensa => ({
	type: 'LOAD_MENSA',
	mensa,
	day,
});

type ReceiveMensa = {
	type: 'RECEIVE_MENSA';
	mensa: MensaId;
	day: MensaDay;
	data: FoodApiResponse;
	resolvedDate: number;
};

const receiveMensa = (
	mensaId: MensaId,
	day: MensaDay,
	data: FoodApiResponse,
	resolvedDate: number
): ReceiveMensa => ({
	type: 'RECEIVE_MENSA',
	mensa: mensaId,
	day,
	data,
	resolvedDate,
});

type ErrorReceivingMensa = {
	type: 'ERROR_RECEIVING_MENSA';
	mensa: MensaId;
	day: MensaDay;
	err: ErrorWithStatusCode;
};

const errorReceivingMensa = (
	mensaId: MensaId,
	day: MensaDay,
	err: ErrorWithStatusCode
): ErrorReceivingMensa => ({
	type: ERROR_RECEIVING_MENSA,
	mensa: mensaId,
	day,
	err,
});

type SetShowCalories = {
	type: 'SET_SHOW_CALORIES';
	shouldShow: boolean;
};

export const setShowCalories = (shouldShow: boolean): SetShowCalories => {
	return {
		type: SET_SHOW_CALORIES,
		shouldShow,
	};
};

export const loadMensa = (
	mensa: MensaId,
	day: MensaDay,
	institution: Institution,
	language: AppLanguage,
	token: string
) => {
	return async (dispatch: ThunkDispatch<{}, {}, any>) => {
		dispatch(loadMensaAction(mensa, day));
		try {
			const foodRes = await apiRequest<ApiFoodResponseWrapped>(
				`/institution/${mapToUniSlug(institution || UZH)}/food/${mensa}/${day}`,
				{
					headers: {
						'x-bestande-token': token,
					},
				}
			);
			dispatch(
				receiveMensa(mensa, day, foodRes.mensa, foodRes.resolvedDate as number)
			);
		} catch (err) {
			dispatch(errorReceivingMensa(mensa, day, err));
		}
	};
};

export const food = (
	state = initialState,
	action:
		| ChangeDay
		| ChangeMensa
		| LoadMensa
		| ReceiveMensa
		| ErrorReceivingMensa
		| ChangePricing
		| ChangePriceRange
		| SetAllergenFilter
		| TurnOffFilter
		| TurnOnFilter
		| SetAllFilters
		| SetAllergenFilter
		| ChangeEnergyFilter
		| SetNutritonFilter
		| SetNowOpenFilter
		| SetShowCalories
): AppFoodState => {
	switch (action.type) {
		case CHANGE_MENSA:
			return {
				...state,
				mensa: action.mensa,
			};
		case LOAD_MENSA:
			return {
				...state,
				...{
					plans: {
						...state.plans,
						[getMensaKey(action.mensa, action.day)]: {
							loading: true,
							data: null,
							error: null,
						},
					},
				},
			};
		case RECEIVE_MENSA:
			return {
				...state,
				plans: {
					...state.plans,
					[getMensaKey(action.mensa, action.day)]: {
						loading: false,
						data: action.data,
						resolvedDate: action.resolvedDate,
						error: null,
					},
				},
			};
		case ERROR_RECEIVING_MENSA:
			return {
				...state,
				plans: {
					...state.plans,
					[getMensaKey(action.mensa, action.day)]: {
						loading: false,
						data: null,
						error: action.err.message,
					},
				},
			};

		case CHANGE_DAY:
			return {
				...state,
				day: action.day,
			};
		case CHANGE_PRICING:
			return {
				...state,
				pricing: action.pricing,
			};
		case TURN_ON_FILTER:
			return {
				...state,
				filters: {
					...state.filters,
					[action.filter]: true,
				},
			};
		case TURN_OFF_FILTER:
			return {
				...state,
				filters: {
					...state.filters,
					[action.filter]: false,
				},
			};
		case SET_ALL_FILTERS:
			return {
				...state,
				filters: action.filters,
			};
		case CHANGE_PRICE_FILTER:
			return {
				...state,
				priceRange: action.priceRange,
			};
		case CHANGE_ENERGY_FILTER:
			return {
				...state,
				energyRange: action.energyRange,
			};
		case SET_NOW_OPEN_FILTER:
			return {
				...state,
				nowOpenFilter: action.isNowOpen,
			};
		case SET_NUTRITION:
			return {
				...state,
				nutrition: action.nutrition,
			};
		case SET_ALLERGEN_FILTER:
			return {
				...state,
				allergenFilter: action.allergenFilter,
			};
		case SET_SHOW_CALORIES:
			return {
				...state,
				showCalories: action.shouldShow,
			};
		default:
			return state;
	}
};
