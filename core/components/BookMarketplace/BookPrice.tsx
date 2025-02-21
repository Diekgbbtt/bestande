import React from 'react';
import {Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {useLanguage} from '../../functions/use-language';
import rawStrings from '../../raw-strings';
import {Book} from '../../types/books';

const Price = styled(Text)`
	text-align: right;
	font-size: 10px;
	color: ${(props) => props.theme.TITLE};
`;

const PriceAmount = styled(Text)`
	font-size: 16px;
	color: ${(props) => props.theme.TITLE};
`;

const Unavailable = styled(Text)`
	font-size: 12px;
	color: ${(props) => props.theme.SUBTITLE};
`;

export const BookPrice: React.FC<{
	book: Book;
}> = ({book}) => {
	const language = useLanguage();
	if (book.available === '1') {
		return (
			<Price>
				<PriceAmount>{book.priceInFrancs}</PriceAmount> CHF
			</Price>
		);
	}

	return <Unavailable>{rawStrings.UNAVAILABLE[language]}</Unavailable>;
};
