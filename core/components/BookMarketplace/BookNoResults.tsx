import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {useLanguage} from '../../functions/use-language';
import rawStrings from '../../raw-strings';
import {SafeSideSpace} from '../SafeSideSpace';

const Container = styled(View)`
	padding-top: 20px;
`;

const Label = styled(Text)`
	text-align: center;
	color: ${(props) => props.theme.SUBTITLE};
	padding: 12px;
`;

export const BookNoResults = () => {
	const language = useLanguage();
	return (
		<SafeSideSpace>
			<Container>
				<Label>{rawStrings.NO_BOOKS_FOUND[language]}</Label>
			</Container>
		</SafeSideSpace>
	);
};
