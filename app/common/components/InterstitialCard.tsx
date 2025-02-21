import {useMemo} from 'react';
import {View} from 'react-native';
import styled from 'styled-components/native';
import {useSideBarWidth} from '../api/use-tablet';

const INTERSTITIAL_CARD_HORIZONTAL_MARGIN = 8;
const INTERSTITIAL_CARD_VERTICAL_MARGIN = 8;

export const InterstitialCard = styled(View)<{
	interstitialHeight: number;
	interstitialWidth: number;
}>`
	border-width: 1px;
	border-color: ${(props) => props.theme.BORDER_COLOR};
	border-radius: 2px;
	height: ${(props) => props.interstitialHeight}px;
	width: ${(props) =>
		props.interstitialWidth - INTERSTITIAL_CARD_HORIZONTAL_MARGIN * 2}px;
	margin: ${INTERSTITIAL_CARD_HORIZONTAL_MARGIN}px
		${INTERSTITIAL_CARD_VERTICAL_MARGIN}px;
	overflow: hidden;
`;

export const useInterstitialDimensions = () => {
	const paneWidth = useSideBarWidth();
	const interstitialWidth = Math.min(500, paneWidth);
	const interstitialHeight = Math.min(
		200,
		(interstitialWidth - INTERSTITIAL_CARD_HORIZONTAL_MARGIN * 2) / 3
	);

	return useMemo(
		() => ({
			interstitialWidth,
			interstitialHeight,
		}),
		[interstitialHeight, interstitialWidth]
	);
};
