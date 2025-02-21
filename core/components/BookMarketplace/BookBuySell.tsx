import React, {useCallback} from 'react';
import {openLink} from '../../functions/open-link';
import {getStudentTradeUniversityBookName} from '../../functions/student-trade-api';
import {useAppearance} from '../../functions/use-appearance';
import {useLanguage} from '../../functions/use-language';
import rawStrings from '../../raw-strings';
import {Book} from '../../types/books';
import {LightButton, LightButtonLabel} from '../LightButton';
import {Row} from '../Primitives';
import {Spacer} from '../UI/Spacer';

export const BookBuySell: React.FC<{
	book: Book;
}> = ({book}) => {
	const appearance = useAppearance();
	const language = useLanguage();

	const buy = useCallback(() => {
		const link =
			'https://www.studenttrade.ch/books_services/buy?identifiers=' +
			book.uni_identifier +
			'&university=' +
			getStudentTradeUniversityBookName(book.institution);
		openLink(link);
	}, [book]);
	const sell = useCallback(() => {
		const link =
			'https://www.studenttrade.ch/books_services/sell?identifiers=' +
			book.uni_identifier +
			'&university=' +
			getStudentTradeUniversityBookName(book.institution);

		openLink(link);
	}, [book]);

	if (book.available !== '1') {
		return null;
	}

	return (
		<Row>
			<LightButton onPress={buy}>
				<LightButtonLabel style={{color: appearance.BLUE_TINT}}>
					{rawStrings.BUY[language]}
				</LightButtonLabel>
			</LightButton>
			<Spacer />
			<LightButton onPress={sell}>
				<LightButtonLabel style={{opacity: 0.8}}>
					{rawStrings.SELL[language]}
				</LightButtonLabel>
			</LightButton>
		</Row>
	);
};
