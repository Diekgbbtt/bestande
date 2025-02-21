import React from 'react';
import {useDispatch} from 'react-redux';
import {useIsomorphicState} from '../functions/use-app-state';
import {webTagStyle} from '../functions/web-tag-style';
import rawStrings from '../raw-strings';
import {setNowOpen} from '../reducers/food';
import {Tag} from './FilterBase';
import WebTouchable from './WebTouchable';

export const MensaNowOpenFilterButton = () => {
	const nowOpen = useIsomorphicState((state) => state.food.nowOpenFilter);
	const dispatch = useDispatch();
	const language = useIsomorphicState(
		(state) => state.language.selectedLanguage
	);
	return (
		<WebTouchable
			style={webTagStyle.touchable}
			onPress={() => {
				dispatch(setNowOpen(!nowOpen));
			}}
		>
			<Tag noTouchable active={nowOpen}>
				{rawStrings.NOW_OPEN[language]}
			</Tag>
		</WebTouchable>
	);
};
