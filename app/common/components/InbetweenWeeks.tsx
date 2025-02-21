import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components';
import {useAppearance} from '../../../core/functions/use-appearance';

const Container = styled(View)`
	width: 0px;
	height: 100%;
	flex: 1;
`;

export const InbetweenWeeks = () => {
	const appearance = useAppearance();
	return (
		<Container>
			<View
				style={{
					borderLeftColor: appearance.BORDER_COLOR,
					borderLeftWidth: 1,
					borderRightColor: appearance.BORDER_COLOR,
					borderRightWidth: 1,
					backgroundColor: appearance.BAR_BACKGROUND,
					width: 3,
					height: '100%',
				}}
			/>
		</Container>
	);
};
