import isEqual from 'lodash/isEqual';
import React from 'react';
import {Platform} from 'react-native';
import {useDispatch} from 'react-redux';
import {renderPriceFilter} from '../functions/render-price-filter';
import {selectCurrentMensa} from '../functions/selectors';
import {truthy} from '../functions/truthy';
import {useIsomorphicState} from '../functions/use-app-state';
import {useLanguage} from '../functions/use-language';
import {useNavigationInNative} from '../functions/useNavigationInNative';
import {webTagStyle} from '../functions/web-tag-style';
import {UZH} from '../models/university';
import rawStrings from '../raw-strings';
import {openMensaDiet} from '../reducers/modals';
import {FilterValue, Tag} from './FilterBase';
import WebTouchable from './WebTouchable';

export const DietFilterButton = () => {
	const dispatch = useDispatch();
	const nutrition = useIsomorphicState((state) => state.food.nutrition);
	const language = useLanguage();
	const energyRange = useIsomorphicState((state) => state.food.energyRange);
	const nutritionFilterActive = nutrition !== 'all';
	const currentMensa = useIsomorphicState((state) => selectCurrentMensa(state));
	const showCalories = useIsomorphicState((state) => state.food.showCalories);
	const navigation = useNavigationInNative();
	const calorieFilterActive =
		(currentMensa.institution === UZH || Platform.OS === 'web') &&
		!isEqual(energyRange, [0, 2000]) &&
		showCalories;
	const calorieLabel = calorieFilterActive
		? renderPriceFilter({
				priceRange: energyRange,
				min: 0,
				max: 2000,
				precision: 0,
		  }) + ' kcal'
		: null;
	const dietLabel = nutritionFilterActive
		? nutrition === 'vegetarian'
			? rawStrings.VEGETARIAN[language]
			: rawStrings.VEGAN[language]
		: null;

	const dietFilterActive = calorieFilterActive || nutritionFilterActive;
	const nutritionLabel = [dietLabel, calorieLabel].filter(truthy).join(', ');
	return (
		<WebTouchable
			style={webTagStyle.touchable}
			onPress={() => {
				if (Platform.OS === 'web') {
					dispatch(openMensaDiet());
				} else {
					navigation.navigate('DietFilter');
				}
			}}
		>
			<Tag noTouchable active={dietFilterActive}>
				{rawStrings.DIET[language]}
				{dietFilterActive ? ': ' : null}
				{dietFilterActive ? (
					<FilterValue active={dietFilterActive}>{nutritionLabel}</FilterValue>
				) : null}
			</Tag>
		</WebTouchable>
	);
};
