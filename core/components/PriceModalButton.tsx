import isEqual from 'lodash/isEqual';
import React from 'react';
import {Platform} from 'react-native';
import {useDispatch} from 'react-redux';
import {renderPriceFilter} from '../functions/render-price-filter';
import {useIsomorphicState} from '../functions/use-app-state';
import {useNavigationInNative} from '../functions/useNavigationInNative';
import {webTagStyle} from '../functions/web-tag-style';
import rawStrings from '../raw-strings';
import {openMensaPriceModal} from '../reducers/modals';
import {FilterValue, Tag} from './FilterBase';
import WebTouchable from './WebTouchable';

export const PriceModalButton = () => {
	const dispatch = useDispatch();
	const language = useIsomorphicState(
		(state) => state.language.selectedLanguage
	);
	const priceRange = useIsomorphicState((state) => state.food.priceRange);
	const navigation = useNavigationInNative();
	const priceFilterActive = !isEqual(priceRange, [1, 20]);

	return (
		<WebTouchable
			style={webTagStyle.touchable}
			onPress={() => {
				if (Platform.OS === 'web') {
					dispatch(openMensaPriceModal());
				} else {
					navigation.navigate('PriceFilter');
				}
			}}
		>
			<Tag noTouchable active={priceFilterActive}>
				{rawStrings.PRICE[language]}
				{priceFilterActive ? ': ' : null}
				{priceFilterActive ? (
					<FilterValue active={priceFilterActive}>
						{`CHF ${renderPriceFilter({
							priceRange,
							min: 1,
							max: 15,
						})}`}
					</FilterValue>
				) : null}
			</Tag>
		</WebTouchable>
	);
};
