import React from 'react';
import {View} from 'react-native';
import {useDispatch} from 'react-redux';
import styled from 'styled-components/native';
import {useAppState, useIsomorphicState} from '../functions/use-app-state';
import {useAppearance} from '../functions/use-appearance';
import {usePull} from '../functions/use-pull';
import {useNavigationInNative} from '../functions/useNavigationInNative';
import {UZH} from '../models/university';
import rawStrings from '../raw-strings';
import {
	changeEnergyRange,
	setNutrition,
	setShowCalories,
} from '../reducers/food';
import {AnimatedNativeScrollView} from './AnimatedScrollView';
import {CheckItem, Label, VSpace} from './Base';
import {BlockTextTitle} from './BlockTextTitle';
import {CellWithSwitch} from './CellWithSwitch';
import {Dismisser} from './Dismisser';
import {MultiSlider} from './MultiSlider';
import {RangeMarker} from './RangeMarker';
import {SafeSideSpace} from './SafeSideSpace';

const Container = styled(AnimatedNativeScrollView)`
	background-color: ${(props) => props.theme.BACKGROUND};
	flex: 1;
`;

export type SliderValue = {
	currentValue: number;
};

export const MensaDietFilter = () => {
	const energy = useAppState((s) => s.institution.institution === UZH);
	const language = useIsomorphicState(
		(state) => state.language.selectedLanguage
	);
	const nutrition = useIsomorphicState((state) => state.food.nutrition);
	const energyRange = useIsomorphicState((state) => state.food.energyRange);
	const appearance = useAppearance();
	const showCalories = useIsomorphicState((state) => state.food.showCalories);
	const navigation = useNavigationInNative();

	const dismisser = usePull({
		pixelsNeeded: 100,
		onPull: () => {
			navigation.goBack();
		},
	});

	const dispatch = useDispatch();
	return (
		<Container {...dismisser.scrollViewProps}>
			<Dismisser progress={dismisser.progress} />

			<SafeSideSpace>
				<View style={{padding: 12}}>
					<BlockTextTitle>{rawStrings.DIET[language]}</BlockTextTitle>
					<VSpace />
					<VSpace />
					<CheckItem
						onPress={() => {
							dispatch(setNutrition('all'));
						}}
						active={nutrition === 'all'}
					>
						<Label active={nutrition === 'all'}>
							{rawStrings.EVERYTHING[language]}
						</Label>
					</CheckItem>
					<VSpace />
					<CheckItem
						onPress={() => {
							dispatch(setNutrition('vegetarian'));
						}}
						active={nutrition === 'vegetarian'}
					>
						<Label active={nutrition === 'vegetarian'}>
							{rawStrings.VEGETARIAN[language]}
						</Label>
					</CheckItem>
					<VSpace />
					<CheckItem
						onPress={() => {
							dispatch(setNutrition('vegan'));
						}}
						active={nutrition === 'vegan'}
					>
						<Label active={nutrition === 'vegan'}>
							{rawStrings.VEGAN[language]}
						</Label>
					</CheckItem>
					<VSpace />
					<VSpace />
					<VSpace />
					{energy ? (
						<React.Fragment>
							<BlockTextTitle>{rawStrings.ENERGY[language]}</BlockTextTitle>
							<VSpace />
							<VSpace />
							{showCalories ? (
								<>
									<VSpace />
									<View style={{alignItems: 'center', marginBottom: 20}}>
										<MultiSlider
											formatValue={(val) => `${val} kcal`}
											color={appearance.BLUE_TINT}
											customMarkerLeft={(e: SliderValue) => (
												<RangeMarker
													left
													value={`${e.currentValue.toFixed()} kcal`}
													color={appearance.TITLE}
												/>
											)}
											customMarkerRight={(e: SliderValue) => (
												<RangeMarker
													right
													value={`${e.currentValue.toFixed()} kcal`}
													color={appearance.TITLE}
												/>
											)}
											onChange={(e: [number, number]) => {
												dispatch(changeEnergyRange(e));
											}}
											values={energyRange}
											min={0}
											max={2000}
											step={50}
										/>
									</View>
								</>
							) : null}
							<CellWithSwitch
								loading={false}
								enabled={showCalories}
								onChange={() => {
									dispatch(setShowCalories(!showCalories));
								}}
								text={rawStrings.SHOW_CALORIES[language]}
							/>
						</React.Fragment>
					) : null}
				</View>
			</SafeSideSpace>
		</Container>
	);
};
