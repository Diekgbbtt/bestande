import React, {ReactElement} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {useAppearance} from '../functions/use-appearance';

const Container = styled(View)`
	border-radius: 2px;
	border-width: ${StyleSheet.hairlineWidth}px;
	justify-content: center;
	align-items: center;
	padding-horizontal: 8px;
	padding-vertical: 4px;
	margin-right: 6px;
`;

export const MealTag = ({children}: {children: ReactElement | string}) => {
	const appearance = useAppearance();
	return (
		<Container style={{borderColor: appearance.MEAL_TAG_BORDER}}>
			<Text style={{color: appearance.MEAL_DESCRIPTION}}>{children}</Text>
		</Container>
	);
};
