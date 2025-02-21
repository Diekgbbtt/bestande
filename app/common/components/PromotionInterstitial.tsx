import {useIsFocused} from '@react-navigation/native';
import React, {useCallback, useEffect} from 'react';
import {Platform, TouchableHighlight} from 'react-native';
import {Image} from 'react-native-normalized';
import styled from 'styled-components';
import {addImpression} from '../../../core/functions/api';
import {getImageUrl} from '../../../core/functions/get-image-url';
import {getUserHash} from '../../../core/functions/get-user-hash';
import {openLink} from '../../../core/functions/open-link';
import {useAppState} from '../../../core/functions/use-app-state';
import {useLanguage} from '../../../core/functions/use-language';
import {useNavigationInNative} from '../../../core/functions/useNavigationInNative';
import {AppLanguage} from '../../../core/models/app-language';
import {CLICK, VIEW} from '../../../core/models/impression-level';
import {PROMOTION} from '../../../core/models/impression-type';
import {PromotionResponse} from '../../../core/models/promotion';
import {InterstitialCard, useInterstitialDimensions} from './InterstitialCard';

const Img = styled(Image)<{
	interstitialHeight: number;
}>`
	width: 100%;
	height: ${(props) => props.interstitialHeight}px;
`;

type Props = {
	promotion: PromotionResponse;
	active?: boolean;
};

const getCdnIdentifier = (
	promotion: PromotionResponse,
	language: AppLanguage
): string => {
	return (
		promotion.translations?.[language]?.image?.cdn_identifier ??
		(promotion.image?.cdn_identifier as string)
	);
};

const getPromotionLink = (
	promotion: PromotionResponse,
	language: AppLanguage
) => {
	return (
		promotion?.translations?.[language]?.promoter_link ??
		promotion.promoter_link
	);
};

export const PromotionInterstitial = ({promotion, active}: Props) => {
	const dim = useInterstitialDimensions();
	const navigation = useNavigationInNative<'CreditView'>();
	const language = useLanguage();
	const institution = useAppState((state) => state.institution.institution);
	const identifier = useAppState((state) => getUserHash(state, null));
	const isFocused = useIsFocused();

	const track = useCallback(() => {
		addImpression({
			institution,
			identifier,
			content: PROMOTION,
			platform: Platform.OS,
			content_id: promotion._id,
			level: VIEW,
			language,
		})
			.then((impression) => {
				return console.log('Added promotion impression', impression);
			})
			.catch((err) => {
				return console.log('Could not add promotion impression', err);
			});
	}, [institution, identifier, language, promotion._id]);

	useEffect(() => {
		if (active && isFocused) {
			track();
		}
	}, [track, active, isFocused]);

	return (
		<InterstitialCard {...dim}>
			<TouchableHighlight
				onPress={() => {
					addImpression({
						institution,
						identifier,
						content: PROMOTION,
						platform: Platform.OS,
						content_id: promotion._id,
						level: CLICK,
						language,
					})
						.then((impression) => {
							return console.log('Added promotion impression', impression);
						})
						.catch((err) => {
							console.log('Could not add primotion impression', err);
						});
					if (promotion.open_in_browser) {
						openLink(getPromotionLink(promotion, language));
					} else {
						navigation.navigate('PromotedEvent', {
							event: promotion,
						});
					}
				}}
			>
				{promotion.image ? (
					<Img
						interstitialHeight={dim.interstitialHeight}
						source={{
							uri: getImageUrl({
								height: dim.interstitialHeight * 2,
								width: dim.interstitialHeight * 2 * 3,
								cdn_identifier: getCdnIdentifier(promotion, language) as string,
								crop: null,
							}),
						}}
					/>
				) : null}
			</TouchableHighlight>
		</InterstitialCard>
	);
};
