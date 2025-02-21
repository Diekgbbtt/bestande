import React, {Fragment} from 'react';
import {View} from 'react-native';
import {useDispatch} from 'react-redux';
import styled from 'styled-components/native';
import {AnimatedNativeScrollView} from '../components/AnimatedScrollView';
import {CheckItem, Label, VSpace} from '../components/Base';
import {Dismisser} from '../components/Dismisser';
import {useIsomorphicState} from '../functions/use-app-state';
import {useLanguage} from '../functions/use-language';
import {usePull} from '../functions/use-pull';
import {useNavigationInNative} from '../functions/useNavigationInNative';
import allergens from '../models/allergens';
import rawStrings from '../raw-strings';
import {setAllergenFilter} from '../reducers/food';
import {SafeSideSpace} from './SafeSideSpace';

const Container = styled(AnimatedNativeScrollView)`
	background-color: ${(props) => props.theme.BACKGROUND};
	flex: 1;
`;

export const MensaAllergensFilter = () => {
	const dispatch = useDispatch();
	const allergenFilter = useIsomorphicState(
		(state) => state.food.allergenFilter
	);
	const language = useLanguage();
	const navigation = useNavigationInNative();
	const dismisser = usePull({
		pixelsNeeded: 100,
		onPull: () => {
			navigation.goBack();
		},
	});

	return (
		<Container {...dismisser.scrollViewProps}>
			<Dismisser progress={dismisser.progress} />
			<SafeSideSpace>
				<View style={{padding: 12}}>
					{allergens.map((a) => (
						<Fragment key={a}>
							<CheckItem
								negative
								active={allergenFilter.includes(a)}
								onPress={() => {
									dispatch(
										setAllergenFilter(
											allergenFilter.includes(a)
												? allergenFilter.filter((allergen) => allergen !== a)
												: [...allergenFilter, a]
										)
									);
								}}
							>
								<Label active={allergenFilter.includes(a)}>
									{rawStrings[a][language]}
								</Label>
							</CheckItem>
							<VSpace />
						</Fragment>
					))}
				</View>
			</SafeSideSpace>
		</Container>
	);
};
