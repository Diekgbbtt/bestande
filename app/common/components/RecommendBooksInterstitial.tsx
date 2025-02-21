import groupBy from 'lodash/groupBy';
import partition from 'lodash/partition';
import React, {FC, useCallback, useMemo, useState} from 'react';
import {View} from 'react-native';
import {ActivityIndicator, Alert, Image, Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {HSpace} from '../../../core/components/Base';
import {
	LightButton,
	LightButtonLabel,
} from '../../../core/components/LightButton';
import {Row} from '../../../core/components/Primitives';
import {getVisibleCredits} from '../../../core/functions/Credits';
import {openLink} from '../../../core/functions/open-link';
import {getStudentTradeUniversityBookName} from '../../../core/functions/student-trade-api';
import {globalStyles} from '../../../core/functions/styles';
import {useAppState} from '../../../core/functions/use-app-state';
import {useLanguage} from '../../../core/functions/use-language';
import rawStrings from '../../../core/raw-strings';
import {Book} from '../../../core/types/books';
import {fetchRecommendedBooks} from '../api/fetch-recommended-books';
import {isCreditBooked} from '../api/is-credit-booked';
import {globalNavigate} from '../api/set-master-navigator';
import {InterstitialCard, useInterstitialDimensions} from './InterstitialCard';
import {TouchableHighlight} from './TouchableHighlight';

const Container = styled(View)`
	flex: 1;
	flex-direction: row;
	padding: 10px;
	justify-content: center;
	align-items: center;
	background-color: ${(props) => props.theme.BACKGROUND};
`;

const LogoImageView = styled(Image)`
	height: 60px;
	width: 60px;
`;

const DescriptionContainer = styled(View)`
	flex: 1;
	margin-left: 14px;
`;

const Title = styled(Text)`
	color: ${(props) => props.theme.TITLE};
	font-weight: bold;
	margin-bottom: 2px;
`;

const Subtitle = styled(Text)`
	color: ${(props) => props.theme.SUBTITLE};
	margin-bottom: 6px;
`;

export const RecommendBooksInterstitial: FC = () => {
	const dim = useInterstitialDimensions();
	const language = useLanguage();
	const [buyLoading, setBuyLoading] = useState(false);
	const [sellLoading, setSellLoading] = useState(false);
	const credits = useAppState((state) => getVisibleCredits(state));
	const [activeNonCustomCredits] = useMemo(
		() => partition(credits, (c) => isCreditBooked(c) && !c.custom),
		[credits]
	);

	const [random] = useState(() => Math.random());

	const tagline = useMemo(() => {
		if (random > 0.5) {
			return rawStrings.BANNER_BUY_SELL_SUBTITLE_1[language];
		}

		return rawStrings.BANNER_BUY_SELL_SUBTITLE_2[language];
	}, [language, random]);

	const goToLink = useCallback(
		(availableBooks: Book[]) => {
			const groupByUniversity = groupBy(availableBooks, (a) => a.institution);

			if (Object.keys(groupByUniversity).length === 0) {
				Alert.alert(
					rawStrings.NOT_ENOUGH_COURSES_TITLE[language],
					rawStrings.NOT_ENOUGH_COURSES[language]
				);
			}

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
		},
		[language]
	);
	const openLinkSell = useCallback(
		(availableBooks: Book[]) => {
			const groupByUniversity = groupBy(availableBooks, (a) => a.institution);

			if (Object.keys(groupByUniversity).length === 0) {
				Alert.alert(
					rawStrings.NOT_ENOUGH_COURSES_TITLE[language],
					rawStrings.NOT_ENOUGH_COURSES[language]
				);
			}

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
		},
		[language]
	);

	const onPress = useCallback(() => {
		globalNavigate('RecommendationBooks');
	}, []);

	const buy = useCallback(async () => {
		try {
			setBuyLoading(true);
			const result = await fetchRecommendedBooks(activeNonCustomCredits);
			goToLink(result);
		} finally {
			setBuyLoading(false);
		}
	}, [activeNonCustomCredits, goToLink]);
	const sell = useCallback(async () => {
		try {
			setSellLoading(true);
			const result = await fetchRecommendedBooks(credits);
			openLinkSell(result);
		} finally {
			setSellLoading(false);
		}
	}, [credits, openLinkSell]);

	return (
		<InterstitialCard {...dim}>
			<TouchableHighlight onPress={onPress} style={globalStyles.flex1}>
				<View style={globalStyles.flex1}>
					<Container style={globalStyles.flex1}>
						<LogoImageView
							resizeMode="contain"
							source={require('../../common/assets/studentbook.png')}
						/>
						<DescriptionContainer>
							<Title>{rawStrings.BANNER_BUY_SELL[language]}</Title>
							<Subtitle>{tagline}</Subtitle>
							<Row>
								<LightButton onPress={buy}>
									<Row style={globalStyles.alignedRow}>
										<LightButtonLabel>
											{rawStrings.BUY[language]}
										</LightButtonLabel>
										{buyLoading && (
											<>
												<HSpace />
												<ActivityIndicator size="small" />
											</>
										)}
									</Row>
								</LightButton>
								<HSpace />
								<LightButton onPress={sell}>
									<Row style={globalStyles.alignedRow}>
										<LightButtonLabel>
											{rawStrings.SELL[language]}
										</LightButtonLabel>
										{sellLoading && (
											<>
												<HSpace />
												<ActivityIndicator size="small" />
											</>
										)}
									</Row>
								</LightButton>
							</Row>
						</DescriptionContainer>
					</Container>
				</View>
			</TouchableHighlight>
		</InterstitialCard>
	);
};
