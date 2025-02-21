import sample from 'lodash/sample';
import {transparentize} from 'polished';
import React from 'react';
import {Linking, View} from 'react-native';
import {Image, Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {useLanguage} from '../../../core/functions/use-language';
import rawStrings from '../../../core/raw-strings';
import {InterstitialCard, useInterstitialDimensions} from './InterstitialCard';
import {TouchableHighlight} from './TouchableHighlight';

const SocialMediaInterstitialView = styled(View)`
	flex: 1;
	flex-direction: row;
	background-color: ${(props) => props.theme.BACKGROUND};
	align-items: center;
	justify-content: center;
`;

const Logo = styled(Image)`
	width: 60px;
	height: 60px;
	margin-right: 25px;
`;

export const Button = styled(View)`
	justify-content: center;
	padding: 6px;
	align-items: center;
`;

export const Highlight = styled(TouchableHighlight)`
	background-color: #3897f0;
	border-radius: 3px;
	margin-top: 8px;
`;

const Label = styled(Text)`
	font-weight: bold;
	font-size: 13px;
	color: ${(props) => props.theme.TITLE};
`;

export const ButtonLabel = styled(Text)`
	color: white;
	font-weight: bold;
	font-size: 13px;
`;

const ad = sample(['instagram', 'facebook']);

export const SocialMediaInterstitial = () => {
	const dim = useInterstitialDimensions();
	const language = useLanguage();

	const title =
		ad === 'instagram'
			? rawStrings.BESTANDE_IS_ON_INSTAGRAM[language]
			: rawStrings.BESTANDE_IS_ON_FACEBOOK[language];

	const buttonLabel =
		ad === 'instagram'
			? rawStrings.FOLLOW[language]
			: rawStrings.LIKE[language];

	const logo =
		ad === 'instagram'
			? require('../assets/instagram.png')
			: require('../assets/facebook.png');

	const open = () => {
		if (ad === 'facebook') {
			Linking.canOpenURL('fb://profile/481883781990580')
				.then((canOpen) => {
					if (canOpen) {
						return Linking.openURL('fb://profile/481883781990580');
					}

						return Linking.openURL('https://facebook.com/Bestande');
				})
				.catch((err) => {
					console.log('Error opening Facebook', err);
				});
		}

		if (ad === 'instagram') {
			Linking.canOpenURL('instagram://user?username=bestande_app')
				.then((canOpen) => {
					if (canOpen) {
						return Linking.openURL('instagram://user?username=bestande_app');
					}

						return Linking.openURL('https://instagram.com/bestande_app');
				})
				.catch((err) => {
					console.log('Error opening Instagram', err);
				});
		}
	};

	return (
		<InterstitialCard {...dim}>
			<SocialMediaInterstitialView>
				<View style={{flexDirection: 'row', alignItems: 'center'}}>
					<Logo source={logo} />
				</View>
				<View>
					<Label>{title}</Label>
					<Highlight
						underlayColor={transparentize(0.3, '#3897f0')}
						onPress={() => {
							open();
						}}
					>
						<Button>
							<ButtonLabel>{buttonLabel}</ButtonLabel>
						</Button>
					</Highlight>
				</View>
			</SocialMediaInterstitialView>
		</InterstitialCard>
	);
};
