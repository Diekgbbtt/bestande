import {MensaDay, MensaId} from '../data/uzh-mensa';
import {Allergen} from '../models/allergens';
import {FoodTag, FoodTagKey} from '../models/food-tags';

export type MensaApiResponse = {
	plan: Meal[];
	tags: FoodTag[];
	slug: string;
	openingHours: string;
	link?: string;
	location?: string;
	name: string;
};

export type FoodApiResponse = MensaApiResponse[];

export type FoodStateType = {
	loading: boolean;
	data: FoodApiResponse | null;
	resolvedDate?: number;
	error: string | null;
};

export type AppFoodState = {
	mensa: MensaId;
	day: MensaDay;
	plans: {[key in string]: FoodStateType};
	pricing: PricingSetting;
	filters: {[key in FoodTagKey]?: boolean};
	nowOpenFilter: boolean;
	priceRange: [number, number];
	nutrition: NutritionFilterValue;
	energyRange: [number, number];
	allergenFilter: Allergen[];
	showCalories: boolean;
};

export type MealPricing = {
	student: string;
	worker: string;
	external: string;
	unit?: string | null;
};

export type NutritionFactType = 'CARBOHYDRATES' | 'FAT' | 'ENERGY' | 'PROTEIN';

type NutritionUnit = 'GRAM' | 'KCAL';

export type NutritionFactValue = {
	unit: NutritionUnit;
	value: number;
};

export type NutritionFilterValue = 'all' | 'vegetarian' | 'vegan';
export type PricingSetting = 'student' | 'worker' | 'external';

export type DbMealPicture = {
	mensa: string;
	meal: string;
	captured: Date;
	token?: string;
	user: string | null;
	source: string;
	isMine?: boolean;
};

export type Meal = {
	title: string;
	allergens: Allergen[];
	description: string[];
	footnote?: string;
	labels?: MealLabel[];
	pricing: MealPricing | null;
	vegetarian?: true;
	vegan?: true;
	nutrition?: {[key in NutritionFactType]: NutritionFactValue};
	swiss_meat?: boolean;
	gluten_free?: boolean;
	origins?: string[];
	health?: 'red' | 'yellow' | 'green';
};
type MealLabel = 'green' | 'yellow' | 'red' | 'vegetarian' | 'swiss';

export type ApiFoodResponseWrapped = {
	resolvedDate: number | Date;
	mensa: FoodApiResponse;
};
