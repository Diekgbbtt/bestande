import React from 'react';
import {View} from 'react-native';
import {useAppearance} from '../../../core/functions/use-appearance';
import {FontWithTransition} from './FontWithTransition';
import {InterstitialCard, useInterstitialDimensions} from './InterstitialCard';
import {ListHeader} from './ListHeader';

export const InterstitialPlaceholder = () => {
	const appearance = useAppearance();
	const dim = useInterstitialDimensions();
	return (
		<View style={{backgroundColor: appearance.INTERSTITIAL_BACKGROUND}}>
			<ListHeader>
				<FontWithTransition text=" " duration={80} />
			</ListHeader>
			<View style={{height: dim.interstitialHeight + 16 + 14}}>
				<InterstitialCard
					{...dim}
					style={{backgroundColor: appearance.BASE_COLOR}}
				/>
			</View>
		</View>
	);
};
