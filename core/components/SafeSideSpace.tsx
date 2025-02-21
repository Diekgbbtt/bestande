import React from 'react';
import {View, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import styled from 'styled-components/native';

const Container = styled(View)<{
	leftInset: number;
	rightInset: number;
}>`
	padding-left: ${(props) => props.leftInset}px;
	padding-right: ${(props) => props.rightInset}px;
`;

export const SafeSideSpace: React.FC<{
	children: React.ReactNode;
	style?: ViewStyle;
}> = ({children, style}) => {
	const {left, right} = useSafeAreaInsets();
	return (
		<Container style={style} leftInset={left} rightInset={right}>
			{children}
		</Container>
	);
};
