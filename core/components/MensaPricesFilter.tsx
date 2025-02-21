import React, {useCallback} from 'react';
import {View} from 'react-native';
import {useDispatch} from 'react-redux';
import styled from 'styled-components/native';
import {Colors} from '../functions/Colors';
import {formatString} from '../functions/format-string';
import {useAppState} from '../functions/use-app-state';
import {useAppearance} from '../functions/use-appearance';
import {useLanguage} from '../functions/use-language';
import {usePull} from '../functions/use-pull';
import {useNavigationInNative} from '../functions/useNavigationInNative';
import rawStrings from '../raw-strings';
import {changePriceRange} from '../reducers/food';
import {AnimatedNativeScrollView} from './AnimatedScrollView';
import {CheckItem, Label, VSpace} from './Base';
import {BlockTextTitle} from './BlockTextTitle';
import {Dismisser} from './Dismisser';
import {SliderValue} from './MensaDietFilter';
import {MultiSlider} from './MultiSlider';
import {RangeMarker} from './RangeMarker';
import {SafeSideSpace} from './SafeSideSpace';

const Container = styled(AnimatedNativeScrollView)`
	background-color: ${(props) => props.theme.BACKGROUND};
	flex: 1;
`;

export const MensaPricesFilter: React.FC<{
	onDismiss?: () => void;
}> = ({onDismiss}) => {
	const dispatch = useDispatch();
	const language = useLanguage();
	const appearance = useAppearance();
	const priceRange = useAppState((s) => s.food.priceRange);

	const navigation = useNavigationInNative();
	const dismisser = usePull({
		pixelsNeeded: 100,
		onPull: () => {
			navigation.goBack();
		},
	});

	const changeRange = useCallback(
		(range: [number, number]) => {
			dispatch(changePriceRange(range));
		},
		[dispatch]
	);

	return (
		<Container {...dismisser.scrollViewProps}>
			<Dismisser progress={dismisser.progress} />
			<SafeSideSpace>
				<View style={{padding: 12}}>
					<BlockTextTitle>{rawStrings.PRICE_FILTER[language]}</BlockTextTitle>
					<View style={{height: 20}} />
					<View style={{alignItems: 'center', marginBottom: 20}}>
						<MultiSlider
							formatValue={(val) => `CHF ${val}`}
							color={Colors.Green}
							customMarkerLeft={(e: SliderValue) => (
								<RangeMarker
									left
									value={`CHF ${e.currentValue.toFixed(2)}`}
									color={appearance.TITLE}
								/>
							)}
							customMarkerRight={(e: SliderValue) => (
								<RangeMarker
									right
									value={`CHF ${e.currentValue.toFixed(2)}`}
									color={appearance.TITLE}
								/>
							)}
							onChange={(e: [number, number]) => {
								changeRange(e);
							}}
							values={priceRange}
							min={1}
							max={20}
							step={0.1}
						/>
					</View>
					<CheckItem
						active={priceRange[0] === 1 && priceRange[1] === 20}
						onPress={() => {
							changeRange([1, 20]);
							onDismiss?.();
						}}
					>
						<Label active={priceRange[0] === 1 && priceRange[1] === 20}>
							{rawStrings.ALL_PRICES[language]}
						</Label>
					</CheckItem>
					<VSpace />
					<CheckItem
						active={priceRange[0] === 1 && priceRange[1] === 7}
						onPress={() => {
							changeRange([1, 7]);
							onDismiss?.();
						}}
					>
						<Label active={priceRange[0] === 1 && priceRange[1] === 7}>
							{formatString(rawStrings.UNDER_X_CHF[language], '7')}
						</Label>
					</CheckItem>
					<VSpace />
					<CheckItem
						active={priceRange[0] === 1 && priceRange[1] === 10}
						onPress={() => {
							changeRange([1, 10]);
							onDismiss?.();
						}}
					>
						<Label active={priceRange[0] === 1 && priceRange[1] === 10}>
							{formatString(rawStrings.UNDER_X_CHF[language], String(10))}
						</Label>
					</CheckItem>
				</View>
			</SafeSideSpace>
		</Container>
	);
};
