import flatten from 'lodash/flatten';
import uniqBy from 'lodash/uniqBy';
import {createSelector} from 'reselect';
import {Mensa, MensaDay} from '../data/uzh-mensa';
import {Allergen} from '../models/allergens';
import {Institution} from '../models/credit';
import {FoodTag, FoodTagKey} from '../models/food-tags';
import {allMensa, allMensaForInstitution} from '../reducers/food';
import {AppState} from '../types/app-state';
import {
	AppFoodState,
	FoodStateType,
	NutritionFilterValue,
	PricingSetting,
} from '../types/food';
import {UniversalState} from '../types/universalState';
import {getMensaKey, initialMensaPlan, resolvedDay} from './mensa-helpers';

const selectInstitution = (state: AppState) => state.institution.institution;
const selectMultiLogin = (state: AppState) => state.multiLogin;

const selectUsername = createSelector(
	selectInstitution,
	selectMultiLogin,
	(institution, multiLogin) =>
		multiLogin[institution] ? multiLogin[institution].username : null
);

const selectFood = (state: UniversalState) => state.food;
export const selectMensaPlan = createSelector(
	selectFood,
	(food) => food.plans[getMensaKey(food.mensa, food.day)] || initialMensaPlan
);

export const selectMensaLabels = createSelector(
	selectMensaPlan,
	(mensaPlan): FoodTag[] =>
		mensaPlan.data
			? uniqBy(
					flatten(
						mensaPlan.data.filter((m) => m.plan.length > 0).map((d) => d.tags)
					),
					(d) => d.key
			  )
			: []
);

const selectFoodDay = createSelector(selectFood, (food) => food.day);
const selectCurrentMensaId = createSelector(selectFood, (food) => food.mensa);
export const selectCurrentMensa = createSelector(
	selectCurrentMensaId,
	(id) => allMensa.find((m) => id === m.id) as Mensa
);
const selectResolvedDay = createSelector(
	selectFood,
	(food) => (day: MensaDay) => resolvedDay({food}, food.mensa, day)
);
const selectPricing = createSelector(selectFood, (food) => food.pricing);
export const selectFilterState = createSelector(
	selectFood,
	(food) => food.filters
);

const selectAllMensa = createSelector(selectInstitution, (institution) =>
	allMensaForInstitution(institution)
);

export const selectImpression = createSelector(
	selectUsername,
	selectInstitution,
	(username, institution) => ({
		username,
		institution,
	})
);

export type MensaInject = {
	mensaPlan: FoodStateType;
	labels: FoodTag[];
	currentDay: MensaDay;
	currentMensa: Mensa;
	resolvedDate: (day: MensaDay) => number | null;
	pricing: PricingSetting;
	filterState: {[key in FoodTagKey]?: boolean};
	priceRange: [number, number];
	institution: Institution;
	nowOpenFilter: boolean;
	allMensa: {institution: Institution; mensa: Mensa[]}[];
	nutrition: NutritionFilterValue;
	energyRange: [number, number];
	allergenFilter: Allergen[];
};

export const selectMensa = createSelector(
	selectMensaPlan,
	selectMensaLabels,
	selectFoodDay,
	selectCurrentMensa,
	selectResolvedDay,
	selectPricing,
	selectFilterState,
	selectInstitution,
	selectAllMensa,
	selectFood,
	(
		mensaPlan: FoodStateType,
		labels: FoodTag[],
		currentDay: MensaDay,
		currentMensa: Mensa,
		resolvedDate: (day: MensaDay) => number | null,
		pricing: PricingSetting,
		filterState: {[key in FoodTagKey]?: boolean},
		institution: Institution,
		_allMensa: {institution: Institution; mensa: Mensa[]}[],
		food: AppFoodState
	): MensaInject => ({
		mensaPlan,
		labels,
		currentDay,
		currentMensa,
		resolvedDate,
		pricing,
		filterState,
		priceRange: food.priceRange,
		institution,
		nowOpenFilter: food.nowOpenFilter,
		allMensa: _allMensa,
		nutrition: food.nutrition,
		energyRange: food.energyRange,
		allergenFilter: food.allergenFilter,
	})
);
