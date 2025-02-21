import groupBy from 'lodash/groupBy';
import React, {useCallback} from 'react';
import {View} from 'react-native';
import {Image, Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {openLink} from '../../functions/open-link';
import {getStudentTradeUniversityBookName} from '../../functions/student-trade-api';
import {globalStyles} from '../../functions/styles';
import {useAppearance} from '../../functions/use-appearance';
import {useLanguage} from '../../functions/use-language';
import rawStrings from '../../raw-strings';
import {Book} from '../../types/books';
import {LightButton, LightButtonLabel} from '../LightButton';
import {Row} from '../Primitives';
import {SafeSideSpace} from '../SafeSideSpace';
import {Spacer} from '../UI/Spacer';

const Container = styled(View)`
	padding: 12px;
`;

const Title = styled(Text)`
	color: ${(props) => props.theme.TITLE};
	font-weight: bold;
	font-size: 15px;
	margin-bottom: 7px;
`;

const Description = styled(Text)`
	color: ${(props) => props.theme.TITLE};
	flex: 1;
`;

const Icon = styled(Image)`
	height: 70px;
	width: 50px;
`;

export const BookExplainer: React.FC<{
	availableBooks: Book[];
}> = ({availableBooks}) => {
	const appearance = useAppearance();
	const language = useLanguage();

	const goToLink = useCallback(() => {
		const groupByUniversity = groupBy(availableBooks, (a) => a.institution);

		openLink(
			'https://www.studenttrade.ch/books_services/buy?identifiers=' +
				groupByUniversity[Object.keys(groupByUniversity)[0]]
					.map((g) => g.uni_identifier)
					.join(',') +
				'&university=' +
				getStudentTradeUniversityBookName(
					groupByUniversity[Object.keys(groupByUniversity)[0]][0].institution
				)
		);
	}, [availableBooks]);
	const openLinkSell = useCallback(() => {
		const groupByUniversity = groupBy(availableBooks, (a) => a.institution);

		openLink(
			'https://www.studenttrade.ch/books_services/sell?identifiers=' +
				groupByUniversity[Object.keys(groupByUniversity)[0]]
					.map((g) => g.uni_identifier)
					.join(',') +
				'&university=' +
				getStudentTradeUniversityBookName(
					groupByUniversity[Object.keys(groupByUniversity)[0]][0].institution
				)
		);
	}, [availableBooks]);

	return (
		<SafeSideSpace>
			<Container>
				<Row>
					<View style={globalStyles.flex1}>
						<Title>{rawStrings.STUDENTTRADE_TITLE[language]}</Title>
						<Row>
							<Icon
								style={{
									height: 317 / 4,
									width: 229 / 4,
									marginLeft: -5,
									marginRight: 10,
									marginTop: -6,
								}}
								source={require('../../assets/book-trade.png')}
							/>

							<Description>
								{rawStrings.STUDENTTRADE_DESCRIPTION[language]}
							</Description>
						</Row>
						{availableBooks.length > 0 ? (
							<>
								<Spacer />
								<LightButton onPress={goToLink}>
									<LightButtonLabel style={{color: appearance.BLUE_TINT}}>
										{rawStrings.BUY_ALL_BOOKS[language]}
									</LightButtonLabel>
								</LightButton>
								<Spacer />
								<LightButton onPress={openLinkSell}>
									<LightButtonLabel>
										{rawStrings.SELL_ALL_BOOKS[language]}
									</LightButtonLabel>
								</LightButton>
							</>
						) : null}
					</View>
				</Row>
			</Container>
		</SafeSideSpace>
	);
};
