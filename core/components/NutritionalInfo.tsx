import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {useIsomorphicState} from '../functions/use-app-state';
import {useAppearance} from '../functions/use-appearance';
import rawStrings from '../raw-strings';
import {NutritionFactType, NutritionFactValue} from '../types/food';

const Container = styled(View)`
	flex-direction: row;
	justify-content: center;
`;

const BulletContainer = styled(View)`
	border-width: 3px;
	align-items: center;
	border-radius: 10px;
	border-bottom-left-radius: 35px;
	border-bottom-right-radius: 35px;
	height: 110px;
	width: 70px;
`;

const MetricName = styled(Text)`
	font-size: 12px;
	color: white;
	text-align: center;
`;

const Gda = styled(View)`
	width: 36px;
	height: 30px;
	border-radius: 18px;
	justify-content: center;
	align-items: center;
`;

const GdaValue = styled(Text)`
	font-size: 12px;
	font-weight: bold;
`;

const getGdaPercentage = (
	name: NutritionFactType,
	info: NutritionFactValue
): number => {
	if (name === 'ENERGY') {
		return info.value / 2250;
	}

	if (name === 'PROTEIN') {
		return info.value / 50;
	}

	if (name === 'CARBOHYDRATES') {
		return info.value / 265;
	}

	if (name === 'FAT') {
		return info.value / 88;
	}

	return 0;
};

const Bullet = ({
	name,
	info,
}: {
	name: NutritionFactType;
	info: NutritionFactValue;
}) => {
	const language = useIsomorphicState(
		(state) => state.language.selectedLanguage
	);
	const appearance = useAppearance();
	return (
		<BulletContainer
			style={{
				backgroundColor: appearance.SUBTITLE,
				borderColor: appearance.BACKGROUND,
			}}
		>
			<View style={{height: 40, justifyContent: 'center'}}>
				<MetricName style={{color: appearance.BACKGROUND}}>
					{rawStrings[name][language]}
				</MetricName>
			</View>
			<View
				style={{
					borderBottomColor: appearance.BACKGROUND,
					borderBottomWidth: 1,
					width: 60,
					marginBottom: 6,
				}}
			/>
			<Text style={{color: appearance.BACKGROUND, fontWeight: 'bold'}}>
				{info.value}
				{info.unit === 'GRAM' ? 'g' : info.unit === 'KCAL' ? 'kcal' : ''}
			</Text>
			<View style={{height: 6}} />
			<Gda style={{backgroundColor: appearance.BACKGROUND}}>
				<GdaValue style={{color: appearance.SUBTITLE}}>
					{Math.round(getGdaPercentage(name, info) * 100)}%
				</GdaValue>
			</Gda>
		</BulletContainer>
	);
};

export const NutritionalInfo = (props: {
	nutrition: {[key in NutritionFactType]: NutritionFactValue};
}) => {
	const keys: NutritionFactType[] = Object.keys(
		props.nutrition
	) as NutritionFactType[];
	const showCalories = useIsomorphicState((state) => state.food.showCalories);
	return (
		<Container>
			{keys
				.filter((k) => k !== 'ENERGY' || showCalories)
				.map((n: NutritionFactType) => {
					return (
						<Bullet
							key={n}
							name={n}
							info={props.nutrition[n] as NutritionFactValue}
						/>
					);
				})}
		</Container>
	);
};
