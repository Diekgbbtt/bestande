/* eslint-disable complexity */

import React, {useState} from 'react';
import {Platform, View} from 'react-native';
import {Image, Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import WebTouchable from '../components/WebTouchable';
import {MensaId} from '../data/uzh-mensa';
import {Colors} from '../functions/Colors';
import {formatString} from '../functions/format-string';
import {globalStyles} from '../functions/styles';
import {truthy} from '../functions/truthy';
import {uiKit} from '../functions/ui-kit';
import {useAppState} from '../functions/use-app-state';
import {useAppearance} from '../functions/use-appearance';
import {useLanguage} from '../functions/use-language';
import rawStrings from '../raw-strings';
import {Meal, PricingSetting} from '../types/food';
import {MealTag} from './MealTag';
import {MensaAdditionalInfo} from './MensaAdditionalInfo';

const font =
	Platform.OS === 'ios' || Platform.OS === 'web' ? 'Roboto Mono' : 'robotomono';

const InfoIcon = styled(Image)`
	width: 20px;
	height: 20px;
	tint-color: rgba(0, 0, 0, 0.4);
`;

const Label = styled(Text)`
	color: black;
`;
const PriceLabel = styled(Text)`
	font-family: ${font};
	color: ${Colors.Green};
	font-weight: bold;
	margin-top: 4px;
`;

const MealTitle = styled(Text)`
	font-weight: bold;
	margin-bottom: 4px;
`;

const OuterMealContainer = styled(View)`
	margin-top: 10px;
`;

const MealContainer = styled(View)`
	flex-direction: column;
	padding-left: 12px;
	padding-bottom: 10px;
	flex: 1;
`;

const Row = styled(View)`
	flex-direction: row;
`;

const Top = styled(View)`
	flex-direction: column;
`;

const Bottom = styled(View)`
	flex-direction: row;
	align-items: center;
`;

const Right = styled(View)`
	padding-right: 16px;
	justify-content: center;
	align-items: flex-end;
	flex-direction: column;
`;

const Vegetarian = styled(Image)`
	height: 20px;
	width: 20px;
	margin-top: 6px;
	margin-left: 4px;
`;

const Labels = styled(View)`
	flex-direction: row;
	margin-top: 4px;
`;

const NoAllergenInfo = styled(Text)`
	color: rgba(0, 0, 0, 0.5);
	font-size: 12px;
	margin-top: 6px;
`;

const healthObj = {
	red: require('../assets/pacman-red.png'),
	yellow: require('../assets/pacman-yellow.png'),
	green: require('../assets/pacman-green.png'),
};

type Props = {
	meal: Meal;
	pricing: PricingSetting;
	mensa: string;
	mensaId: MensaId;
};

export const MealComponent: React.FC<Props> = (props) => {
	const [additionalOpen, setAdditionalOpen] = useState(false);
	const appearance = useAppearance();
	const allergenFilter = useAppState((s) => s.food.allergenFilter);
	const language = useLanguage();
	const showCalories = useAppState((s) => s.food.showCalories);

	const {meal} = props;
	const {
		title,
		description,
		footnote,
		pricing,
		vegetarian,
		swiss_meat,
		vegan,
		gluten_free,
		allergens,
		nutrition,
		origins,
		health,
	} = meal;
	return (
		<OuterMealContainer>
			<Row>
				<MealContainer>
					<Top>
						<MealTitle
							style={[uiKit.subheadEmphasizedObject, {color: appearance.TITLE}]}
						>
							{title}
						</MealTitle>
						{/* eslint-disable react/no-array-index-key */}
						{(description || []).map((d, i) => {
							return (
								<View key={d + i}>
									<Label
										style={{
											...uiKit.footnoteObject,
											fontSize: 14,
											color: appearance.MEAL_DESCRIPTION,
										}}
									>
										{d}
									</Label>
								</View>
							);
						})}
						{/* eslint-enable react/no-array-index-key */}
						{footnote ? (
							<Label
								style={{
									...uiKit.footnoteObject,
									fontSize: 14,
									color: appearance.MEAL_DESCRIPTION,
								}}
							>
								{footnote}
							</Label>
						) : null}
						<Labels>
							{health ? <Vegetarian source={healthObj[health]} /> : null}
							{vegetarian ? (
								<MealTag>{rawStrings.VEGETARIAN[language]}</MealTag>
							) : null}
							{swiss_meat ? (
								<MealTag>{rawStrings.SWISS_MEAT[language]}</MealTag>
							) : null}
							{vegan ? <MealTag>{rawStrings.VEGAN[language]}</MealTag> : null}
							{gluten_free ||
							(allergens &&
								allergens.length > 0 &&
								!allergens.includes('GLUTEN_WHEAT')) ? (
								<MealTag>{rawStrings.GLUTEN_FREE[language]}</MealTag>
							) : null}
							{nutrition?.ENERGY && showCalories ? (
								<MealTag>{String(`${nutrition.ENERGY.value} kcal`)}</MealTag>
							) : null}
						</Labels>
						{allergenFilter.length > 0 &&
						(!allergens || allergens.length === 0) ? (
							<View>
								<NoAllergenInfo>
									{formatString(
										rawStrings.NO_ALLERGY_INFO[language],
										allergenFilter
											.map((allergen) => rawStrings[allergen][language])
											.join('/')
									)}
								</NoAllergenInfo>
							</View>
						) : null}
					</Top>
					<Bottom>
						<View style={{height: 5}} />
						{pricing?.[props.pricing] ? (
							<PriceLabel>CHF {pricing[props.pricing]}</PriceLabel>
						) : null}
						<View style={{height: 5}} />
					</Bottom>
				</MealContainer>
				<Right>
					<View style={globalStyles.flex1} />
					<View style={globalStyles.alignedRow}>
						{(allergens && allergens.filter(truthy).length > 0) ||
						nutrition ||
						origins ? (
							<WebTouchable
								onPress={() => {
									setAdditionalOpen((p) => !p);
								}}
								style={{padding: 5, marginRight: -8}}
							>
								<InfoIcon
									style={{tintColor: appearance.ICON_TINT}}
									source={
										additionalOpen
											? require('../assets/baseline_info_black_48dp.png')
											: require('../assets/outline_info_black_48dp.png')
									}
								/>
							</WebTouchable>
						) : null}
					</View>

					<View style={{height: 2}} />
				</Right>
			</Row>
			{additionalOpen ? <MensaAdditionalInfo meal={meal} /> : null}
		</OuterMealContainer>
	);
};
