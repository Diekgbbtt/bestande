import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {useLanguage} from '../../../core/functions/use-language';
import rawStrings from '../../../core/raw-strings';

const Container = styled(View)`
	flex: 1;
	justify-content: center;
	align-items: center;
	background-color: ${(props) => props.theme.BACKGROUND};
`;

const Title = styled(Text)`
	color: ${(props) => props.theme.SUBTITLE};
	font-size: 18px;
`;

export const NoCreditSelectedView = () => {
	const language = useLanguage();
	return (
		<Container>
			<Title>{rawStrings.NO_CREDIT_SELECTED[language]}</Title>
		</Container>
	);
};
