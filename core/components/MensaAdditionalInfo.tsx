import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {truthy} from '../functions/truthy';
import {useAppearance} from '../functions/use-appearance';
import {useLanguage} from '../functions/use-language';
import rawStrings from '../raw-strings';
import {Meal} from '../types/food';
import {NutritionalInfo} from './NutritionalInfo';

const AdditionalInfo = styled(View)`
	padding-top: 6px;
	padding-bottom: 6px;
	padding-left: 16px;
	padding-right: 24px;
	border-top-width: 1px;
	border-color: rgba(0, 0, 0, 0.1);
`;

const Label = styled(Text)`
	color: ${(props) => props.theme.SUBTITLE};
`;

export const MensaAdditionalInfo = (props: {meal: Meal}) => {
	const language = useLanguage();
	const appearance = useAppearance();
	return (
		<AdditionalInfo
			style={{backgroundColor: appearance.INTERSTITIAL_BACKGROUND}}
		>
			{props.meal.allergens &&
			props.meal.allergens.filter(truthy).length > 0 ? (
				<View>
					<Label style={{fontWeight: 'bold'}}>
						{rawStrings.ALLERGENS[language]}
					</Label>
					<Label>
						{props.meal.allergens
							.map((a) => rawStrings[a][language])
							.join(', ')}
					</Label>
				</View>
			) : null}
			{props.meal.allergens && props.meal.nutrition ? (
				<View style={{height: 8}} />
			) : null}
			{props.meal.nutrition ? (
				<View>
					<Label style={{fontWeight: 'bold', marginBottom: 5}}>
						{rawStrings.NUTRITIONAL_INFO[language]}
					</Label>
					<NutritionalInfo nutrition={props.meal.nutrition} />
				</View>
			) : null}
			{(props.meal.allergens || props.meal.nutrition) && props.meal.origins ? (
				<View style={{height: 8}} />
			) : null}

			{props.meal.origins ? (
				<View>
					<Label style={{fontWeight: 'bold'}}>
						{rawStrings.ORIGINS[language]}
					</Label>
					<Label>{props.meal.origins.join(', ')}</Label>
				</View>
			) : null}
		</AdditionalInfo>
	);
};
