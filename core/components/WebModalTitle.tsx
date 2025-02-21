import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components/native';

const Container = styled(View)`
	background-color: rgba(0, 0, 0, 0.03);
	text-align: center;
	padding-top: 12px;
	padding-bottom: 12px;
	border-bottom-width: 1px;
	border-bottom-color: rgba(0, 0, 0, 0.1);
`;

const Label = styled(Text)`
	font-weight: bold;
	font-size: 15px;
	color: rgba(0, 0, 0, 0.7);
`;

export const WebModalTitle = (props: {children: string}) => {
	return (
		<Container>
			<Label>{props.children}</Label>
		</Container>
	);
};
