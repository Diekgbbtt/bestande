import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components/native';

const Container = styled(View)`
	background-color: ${(props) => props.theme.BORDER_COLOR};
	border-color: rgba(0, 0, 0, 0.06);
	border-width: 1px;
	border-left-width: 3px;
	height: 55px;
	width: 40px;
	margin-right: 8px;
`;

export const BookPreview: React.FC = () => {
	return <Container />;
};
