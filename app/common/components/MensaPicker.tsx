import flatten from 'lodash/flatten';
import {transparentize} from 'polished';
import React, {useEffect, useRef} from 'react';
import {Platform, ScrollView, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Text} from 'react-native-normalized';
import {useDispatch} from 'react-redux';
import styled from 'styled-components/native';
import {Mensa} from '../../../core/data/uzh-mensa';
import {useAppState} from '../../../core/functions/use-app-state';
import {useAppearance} from '../../../core/functions/use-appearance';
import {
	allMensa as allMensaObj,
	allMensaForInstitution,
	changeMensa,
	retiredCanteens,
} from '../../../core/reducers/food';

const MensaPickerContainer = styled(ScrollView).attrs({
	horizontal: true,

	showsHorizontalScrollIndicator: false,
	contentContainerStyle: {
		alignItems: 'center',
		paddingLeft: 8,
		paddingRight: 20,
	},
})`
	flex-direction: row;
`;

const MensaButton = styled(TouchableOpacity)`
	padding: 8px;
	padding-left: 15px;
	padding-right: 15px;
	border-radius: 30px;
`;

const MensaHeader = () => {
	const currentMensa = useAppState((state) =>
		allMensaObj.find((m) => m.id === state.food.mensa)
	) as Mensa;
	const allMensa = useAppState((state) =>
		allMensaForInstitution(state.institution.institution)
	);
	const dispatch = useDispatch();
	const scrollViewRef = useRef<ScrollView>(null);
	const mensas = flatten(
		allMensa.map((m) =>
			m.mensa.filter((_m) => !retiredCanteens.find((r) => r === _m.id))
		)
	);
	useEffect(() => {
		if (Platform.OS === 'web') {
			return;
		}

		const index = mensas.findIndex((m) => m.id === currentMensa.id);
		if (index > 1) {
			scrollViewRef.current?.scrollToEnd();
		} else {
			scrollViewRef.current?.scrollTo();
		}
	}, [currentMensa, currentMensa.id, mensas]);

	const appearance = useAppearance();
	return (
		<>
			<MensaPickerContainer ref={scrollViewRef}>
				{mensas.map((mensa) => {
					const isActive = currentMensa.id === mensa.id;
					return (
						<View key={mensa.name}>
							<MensaButton
								key={mensa.name}
								style={{
									backgroundColor: isActive ? 'white' : 'transparent',
								}}
								onPress={() => {
									dispatch(changeMensa(mensa.id));
								}}
							>
								<Text
									style={{
										color: isActive
											? appearance.HEADER_BACKGROUND
											: appearance.HEADER_SUBTITLE_COLOR,
										fontWeight: 'bold',
										fontSize: 16,
									}}
								>
									{mensa.name}
								</Text>
							</MensaButton>
						</View>
					);
				})}
			</MensaPickerContainer>
			<LinearGradient
				pointerEvents="none"
				colors={[
					appearance.HEADER_BACKGROUND,
					transparentize(1, appearance.HEADER_BACKGROUND),
				]}
				start={{x: 0, y: 0}}
				end={{x: 1, y: 0}}
				style={{
					height: 40,
					width: 8,
					position: 'absolute',
					left: 0,
				}}
			/>
			<LinearGradient
				pointerEvents="none"
				colors={[
					appearance.HEADER_BACKGROUND,
					transparentize(1, appearance.HEADER_BACKGROUND),
				]}
				end={{x: 0, y: 0}}
				start={{x: 1, y: 0}}
				style={{
					height: 40,
					width: 20,
					position: 'absolute',
					right: 0,
				}}
			/>
		</>
	);
};

export default MensaHeader;
