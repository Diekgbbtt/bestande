import React from 'react';
import {Platform} from 'react-native';
import {useDispatch} from 'react-redux';
import WebTouchable from '../components/WebTouchable';
import {useIsomorphicState} from '../functions/use-app-state';
import {useNavigationInNative} from '../functions/useNavigationInNative';
import {webTagStyle} from '../functions/web-tag-style';
import rawStrings from '../raw-strings';
import {openMensaAllergens} from '../reducers/modals';
import {FilterValue, Tag} from './FilterBase';

export const MensaAllergenFilterButton = () => {
	const dispatch = useDispatch();
	const navigation = useNavigationInNative();
	const language = useIsomorphicState(
		(state) => state.language.selectedLanguage
	);
	const allergenFilter = useIsomorphicState(
		(state) => state.food.allergenFilter
	);
	const allergenFilterActive = allergenFilter.length > 0;
	const allergenLabel = allergenFilterActive
		? allergenFilter.map((a) => rawStrings[a][language]).join(', ')
		: null;
	return (
		<WebTouchable
			style={webTagStyle.touchable}
			onPress={() => {
				if (Platform.OS === 'web') {
					dispatch(openMensaAllergens());
				} else {
					navigation.navigate('AllergenFilter');
				}
			}}
		>
			<Tag noTouchable negative active={allergenFilterActive}>
				{rawStrings.ALLERGIES[language]}
				{allergenFilterActive ? ': ' : null}
				{allergenFilterActive ? (
					<FilterValue active={allergenFilterActive}>
						{allergenLabel}
					</FilterValue>
				) : null}
			</Tag>
		</WebTouchable>
	);
};
