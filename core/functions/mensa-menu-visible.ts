import {Allergen} from '../models/allergens';
import {Meal, NutritionFilterValue, PricingSetting} from '../types/food';

export const mensaMenuVisible = (
	meal: Meal,
	{
		nutrition,
		pricing,
		priceRange,
		energyRange,
		allergenFilter,
		calorieFilter,
	}: {
		nutrition: NutritionFilterValue;
		pricing: PricingSetting;
		priceRange: [number, number];
		energyRange: [number, number];
		calorieFilter: boolean;
		allergenFilter: Allergen[];
	}
): boolean => {
	const filters = [
		(p: Meal): boolean => {
			const price = p.pricing?.[pricing];
			if (!price) {
				return true;
			}

			const parsed = parseFloat(price);
			if (isNaN(parsed)) {
				return true;
			}

			if (parsed < priceRange[0]) {
				return false;
			}

			if (parsed > priceRange[1]) {
				return false;
			}

			return true;
		},
		(p: Meal): boolean => {
			if (nutrition === 'all') {
				return true;
			}

			if (nutrition === 'vegetarian') {
				return Boolean(p.vegetarian || p.vegan);
			}

			if (nutrition === 'vegan') {
				return Boolean(p.vegan);
			}

			return true;
		},
		(p: Meal): boolean => {
			if (!p.nutrition || !p.nutrition.ENERGY) {
				return true;
			}

			if (!calorieFilter) {
				return true;
			}

			return (
				p.nutrition.ENERGY.value <= energyRange[1] &&
				p.nutrition.ENERGY.value >= energyRange[0]
			);
		},
		(p: Meal): boolean => {
			if (!p.allergens) {
				return true;
			}

			return !p.allergens.find((allergen) => allergenFilter.includes(allergen));
		},
	];
	return filters.every((f) => f(meal));
};
