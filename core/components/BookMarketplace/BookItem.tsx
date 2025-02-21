import React, {useCallback} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {CreditHelpers} from '../../functions/CreditHelpers';
import {getCredit} from '../../functions/get-credit';
import {useAppState} from '../../functions/use-app-state';
import {useNavigationInNative} from '../../functions/useNavigationInNative';
import {Book} from '../../types/books';
import {Row} from '../Primitives';
import {SafeSideSpace} from '../SafeSideSpace';
import {Spacer} from '../UI/Spacer';
import {BookBuySell} from './BookBuySell';
import {BookCourse} from './BookCourse';
import {BookPreview} from './BookPreview';
import {BookPrice} from './BookPrice';

const TitleText = styled(Text)`
	font-size: 13px;
	color: ${(props) => props.theme.UZH_LOGO_TINT_COLOR};
	margin-bottom: 4px;
`;

const TitleColumn = styled(View)<{}>`
	flex-direction: column;
	border-radius: 5px;
	flex: 1;
`;

const PriceColumn = styled(View)<{}>`
	flex-direction: column;
	align-items: flex-end;
	width: 80px;
`;

export const BookItem: React.FC<{
	book: Book;
	showCourse: boolean;
}> = ({book, showCourse}) => {
	const navigation = useNavigationInNative();
	const credit = useAppState((s) =>
		showCourse
			? getCredit(s, book.uni_identifier, null, book.institution)
			: null
	);

	const onPress = useCallback(() => {
		if (!showCourse || credit === null) {
			return;
		}

		navigation.navigate('CreditDetailView', {
			moduleId: book.uni_identifier,
			institution: book.institution,
			chatFirst: false,
			semester: CreditHelpers.getSemester(credit),
			credit,
		});
	}, [book.institution, book.uni_identifier, credit, navigation, showCourse]);

	return (
		<SafeSideSpace>
			<TouchableOpacity onPress={onPress}>
				<View>
					{showCourse ? (
						<BookCourse
							uni_identifier={book.uni_identifier}
							institution={book.institution}
						/>
					) : null}
					<Row>
						<BookPreview />
						<TitleColumn>
							<TitleText>{book.title}</TitleText>
						</TitleColumn>
						<PriceColumn>
							<BookPrice book={book} />
						</PriceColumn>
					</Row>
					<Spacer />
					<BookBuySell book={book} />
				</View>
			</TouchableOpacity>
		</SafeSideSpace>
	);
};
