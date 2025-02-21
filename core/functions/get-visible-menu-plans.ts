import {AppFoodState, Meal} from '../types/food';
import {mensaMenuVisible} from './mensa-menu-visible';

export const getVisibleMenuPlans = (foodState: AppFoodState, plan: Meal[]) => {
	return plan.filter((p) =>
		mensaMenuVisible(p, {
			nutrition: foodState.nutrition,
			pricing: foodState.pricing,
			priceRange: foodState.priceRange,
			energyRange: foodState.energyRange,
			allergenFilter: foodState.allergenFilter,
			calorieFilter: foodState.showCalories,
		})
	);
};
