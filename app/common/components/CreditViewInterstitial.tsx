import React, {ReactElement, useCallback, useMemo, useState} from 'react';
import {
	NativeScrollEvent,
	NativeSyntheticEvent,
	Platform,
	ScrollView,
	View,
} from 'react-native';
import styled from 'styled-components/native';
import {Config} from '../../../core/data/Config';
import {getVisibleCredits} from '../../../core/functions/Credits';
import {formatString} from '../../../core/functions/format-string';
import {truthy} from '../../../core/functions/truthy';
import {useAppState} from '../../../core/functions/use-app-state';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import {AppLanguage} from '../../../core/models/app-language';
import {Credit, Institution} from '../../../core/models/credit';
import {PromotionResponse} from '../../../core/models/promotion';
import {PROMOTION} from '../../../core/models/promotion-type';
import rawStrings from '../../../core/raw-strings';
import {AppState} from '../../../core/types/app-state';
import {getUnratedCredits} from '../api/get-unrated-credits';
import {FontWithTransition} from './FontWithTransition';
import {useInterstitialDimensions} from './InterstitialCard';
import {InterstitialPlaceholder} from './InterstitialPlaceHolder';
import {ListHeader} from './ListHeader';
import {PromotionInterstitial} from './PromotionInterstitial';
import {RecommendBooksInterstitial} from './RecommendBooksInterstitial';
import {ScrollViewDots} from './ScrollViewDots';
import {SocialMediaInterstitial} from './SocialMediaInterstitial';

const getPromotions = (state: AppState): PromotionResponse[] => {
	const promotionIds = Object.keys(state.promotions.promotions);
	const promotions = promotionIds.map(
		(pId) => state.promotions.promotions[pId].data
	);
	const interstitialPromotions = promotions
		.filter(truthy)
		.filter((p) => p.type === PROMOTION);
	return interstitialPromotions;
};

type InterstitialCardType = {
	title: string;
	rightTitle?: string;
	card: ReactElement;
};

const randomNess = new Array(15).fill(0).map(() => Math.random());

function shuffle<T>(array: T[]): T[] {
	const length = array === null ? 0 : array.length;
	if (!length) {
		return [];
	}

	let index = -1;
	const lastIndex = length - 1;
	const result = [...array];
	while (++index < length) {
		const rand =
			index + Math.floor(randomNess[index] * (lastIndex - index + 1));
		const value = result[rand];
		result[rand] = result[index];
		result[index] = value;
	}

	return result;
}

const getPromotionTitle = (
	promotion: PromotionResponse,
	language: AppLanguage
) => {
	return promotion?.translations?.[language]?.name ?? promotion.name;
};

const getPromotionPromoterName = (
	promotion: PromotionResponse,
	language: AppLanguage
) => {
	return promotion?.translations?.[language]?.promoter ?? promotion.promoter;
};

const getCards = (
	unratedCredits: Credit[],
	promotions: PromotionResponse[],
	language: AppLanguage,
	institution: Institution,
	dim: ReturnType<typeof useInterstitialDimensions>
): InterstitialCardType[] => {
	let cards: {
		card: JSX.Element;
		title: string;
		rightTitle?: string;
	}[] = [];

	if (Config.RECOMMENDED_BOOKS) {
		cards = [
			...cards,
			{
				title: rawStrings.GET_BOOKS[language],
				card: <RecommendBooksInterstitial />,
			},
		];
	}

	cards = [
		...cards,
		{
			title: rawStrings.SOCIAL_MEDIA[language],
			card: <SocialMediaInterstitial />,
		},
	];
	cards = shuffle(cards);
	const hasExclusive = Boolean(promotions.find((p) => p.exclusive));
	cards = [
		...promotions.map((p) => ({
			title: getPromotionTitle(p, language),
			card: <PromotionInterstitial promotion={p} />,
			rightTitle: formatString(
				rawStrings.SPONSORED_BY[language],
				getPromotionPromoterName(p, language)
			),
		})),
		...(hasExclusive ? [] : cards),
	];
	return cards;
};

const OuterRow = styled(View)`
	flex-direction: row;
	justify-content: center;
`;

const CenteredRow = styled(View)<{
	interstitialWidth: number;
}>`
	flex-direction: row;
	justify-content: center;
	align-items: center;
	width: ${(props) => props.interstitialWidth}px;
`;

export const CreditViewInterstitial = () => {
	const dim = useInterstitialDimensions();
	const ratingsLoading = useAppState(
		(state) => state.multiMyRatings[state.institution.institution].loading
	);
	const promotionsLoading = useAppState(
		(state) => !state.promotions.triedLoading
	);
	const isLoading = [ratingsLoading, promotionsLoading].some(Boolean);

	const myRatings = useAppState(
		(state) => state.multiMyRatings[state.institution.institution].ratings
	);
	const visibleCredits = useAppState((state) => getVisibleCredits(state));
	const unratedCredits = getUnratedCredits(visibleCredits, myRatings);
	const language = useLanguage();
	const institution = useAppState((state) => state.institution.institution);
	const promotions = useAppState((state) => getPromotions(state));
	const cards = getCards(
		unratedCredits,
		promotions,
		language,
		institution,
		dim
	);
	const [index, setIndex] = useState(0);
	const appearance = useAppearance();

	const onScroll = useCallback(
		(event: NativeSyntheticEvent<NativeScrollEvent>) => {
			const newIndex = Math.floor(
				(event.nativeEvent.contentOffset.x + dim.interstitialWidth / 2) /
					dim.interstitialWidth
			);
			if (newIndex !== index) {
				console.log('new index', newIndex);
				setIndex(newIndex);
			}
		},
		[dim.interstitialWidth, index]
	);

	const scrollViewStyle = useMemo(() => {
		return {
			width: dim.interstitialWidth,
			height: dim.interstitialHeight + 8,
		};
	}, [dim.interstitialHeight, dim.interstitialWidth]);

	if (isLoading) {
		return <InterstitialPlaceholder />;
	}

	return (
		<View
			style={{
				backgroundColor: appearance.INTERSTITIAL_BACKGROUND,
			}}
		>
			<ListHeader
				right={
					<FontWithTransition
						text={cards[index].rightTitle as string}
						duration={80}
					/>
				}
			>
				<FontWithTransition text={cards[index].title} duration={80} />
			</ListHeader>
			<OuterRow>
				<CenteredRow interstitialWidth={dim.interstitialWidth}>
					<ScrollView
						bounces
						removeClippedSubviews={false}
						automaticallyAdjustContentInsets
						horizontal
						snapToInterval={dim.interstitialWidth}
						showsHorizontalScrollIndicator={false}
						style={scrollViewStyle}
						onScroll={onScroll}
						decelerationRate={Platform.OS === 'ios' ? 'fast' : 0.9}
						scrollEventThrottle={16}
					>
						{cards.map((c, i) => {
							return (
								<View key={c.title}>
									{React.cloneElement(c.card, {
										active: index === i,
									})}
								</View>
							);
						})}
					</ScrollView>
				</CenteredRow>
			</OuterRow>
			{cards.length > 1 ? (
				<ScrollViewDots index={index} numberOfDots={cards.length} />
			) : null}
		</View>
	);
};
