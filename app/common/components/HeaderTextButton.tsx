import React from 'react';
import {Text} from 'react-native-normalized';
import styled from 'styled-components/native';

const Label = styled(Text)`
	color: white;
	font-size: 15px;
	margin-right: 10px;
	font-weight: bold;
`;

export const HeaderTextButton: React.FC<{children: string}> = (props) => {
	return <Label>{props.children}</Label>;
};
