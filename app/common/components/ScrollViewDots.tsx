import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components/native';

const Container = styled(View)`
	flex-direction: row;
	justify-content: center;
	padding-top: 7px;
	padding-bottom: 7px;
`;

const Dot = styled(View)<{
	active: boolean;
}>`
	width: 6px;
	height: 6px;
	border-radius: 3px;
	background-color: ${(props) =>
		props.active ? props.theme.SUBTITLE : props.theme.BORDER_COLOR};
	margin-left: 2px;
	margin-right: 2px;
`;

export const ScrollViewDots: React.FC<{
	numberOfDots: number;
	index: number;
}> = ({numberOfDots, index}) => {
	return (
		<Container>
			{new Array(numberOfDots)
				.fill(true)
				.map((d, i) => i)
				.map((i) => {
					return <Dot key={i} active={index === i} />;
				})}
		</Container>
	);
};
