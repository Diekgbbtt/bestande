import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components/native';
import {useSideBarWidth} from '../api/use-tablet';
import MakeNavigation from './Navigation';

const Container = styled(View)<{
	sideBarWidth: number;
}>`
	width: 25%;
	min-width: ${(props) => props.sideBarWidth}px;
	border-right-width: 1px;
	border-right-color: ${(props) => props.theme.BORDER_COLOR};
`;

export const CreditSidebar = () => {
	const sideBarWidth = useSideBarWidth();
	return (
		<Container sideBarWidth={sideBarWidth}>
			<NavigationContainer independent>
				<MakeNavigation
					include={['LeftPaneCreditView']}
					initialRouteName="CreditView"
				/>
			</NavigationContainer>
		</Container>
	);
};
