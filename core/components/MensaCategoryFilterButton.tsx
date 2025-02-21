import React from 'react';
import {Platform} from 'react-native';
import {useDispatch} from 'react-redux';
import WebTouchable from '../components/WebTouchable';
import {useIsomorphicState} from '../functions/use-app-state';
import {useNavigationInNative} from '../functions/useNavigationInNative';
import {webTagStyle} from '../functions/web-tag-style';
import {FoodTag, FoodTagKey} from '../models/food-tags';
import rawStrings from '../raw-strings';
import {openMensaCategories} from '../reducers/modals';
import {FilterValue, Tag} from './FilterBase';

export const MensaCategoryFilterButton = (props: {
	labels: FoodTag[];
	filterState: {[key in FoodTagKey]?: boolean};
}) => {
	const dispatch = useDispatch();
	const navigation = useNavigationInNative();
	const language = useIsomorphicState(
		(state) => state.language.selectedLanguage
	);

	const labelsActive = props.labels.filter(
		(l) => props.filterState[l.key] !== false
	);
	const labelFilterActive = props.labels.length !== labelsActive.length;

	return (
		<WebTouchable
			style={webTagStyle.touchable}
			onPress={() => {
				if (Platform.OS === 'web') {
					dispatch(openMensaCategories());
				} else {
					navigation.navigate('MensaCategoryFilter');
				}
			}}
		>
			<Tag noTouchable active={labelFilterActive}>
				{rawStrings.TYPE[language]}
				{labelFilterActive ? (
					<FilterValue active={labelFilterActive}>
						{labelFilterActive ? ` (${labelsActive.length})` : null}
					</FilterValue>
				) : null}
			</Tag>
		</WebTouchable>
	);
};
