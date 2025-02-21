import React, {Fragment, useState} from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {globalStyles} from '../functions/styles';
import {useLanguage} from '../functions/use-language';
import {Institution} from '../models/credit';
import rawStrings from '../raw-strings';
import {Book} from '../types/books';
import {VSpace} from './Base';
import {BlockTextTitle} from './BlockTextTitle';
import {BookItem} from './BookMarketplace/BookItem';
import {Row} from './Primitives';

const Container = styled(View)<{}>`
	flex: 1;
	background-color: ${(props) => props.theme.BACKGROUND};
`;

const Subtitle = styled(Text)`
	color: ${(props) => props.theme.SUBTITLE};
`;

const TitleRow = styled(Row)`
	margin-bottom: 2px;
`;

const BooksSection: React.FC<{
	uni_identifier: string;
	university: Institution;
}> = ({uni_identifier, university}) => {
	const [loadedBooks, setloadedBooks] = useState<Book[]>([]);
	const language = useLanguage();

	// const CallBooksApi = useCallback(async () => {
	// 	const result = await fetchBooks([uni_identifier], university);
	// 	const books = await result.json();

	// 	const temp: Book[] = [];
	// 	if (books.courses) {
	// 		books.courses.forEach((course: Course) => {
	// 			course.books.forEach((book: Book) =>
	// 				temp.push({
	// 					...book,
	// 					uni_identifier: course.id,
	// 					institution: getInstitutionByStudenttradeName(
	// 						course.university
	// 					),
	// 				})
	// 			);
	// 		});
	// 	}

	// 	setloadedBooks(temp);
	// }, [uni_identifier, university]);

	// useEffect(() => {
	// 	CallBooksApi();
	// }, [CallBooksApi]);

	if (loadedBooks.length === 0) {
		return null;
	}

	return (
		<Container>
			<TitleRow>
				<BlockTextTitle>{rawStrings.BOOKS[language]}</BlockTextTitle>
				<View style={globalStyles.flex1} />
				<Subtitle>via studenttrade.ch</Subtitle>
			</TitleRow>
			{loadedBooks.map((book) => {
				return (
					<Fragment key={book.title}>
						<BookItem key={book.title} book={book} showCourse={false} />
						<VSpace />
					</Fragment>
				);
			})}
			<VSpace />
		</Container>
	);
};

export default BooksSection;
