import {darken} from 'polished';
import React from 'react';
import {Animated, Platform, View} from 'react-native';
import {Image, Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import {Institution} from '../../../core/models/credit';
import {ETH, UZH} from '../../../core/models/university';
import rawStrings from '../../../core/raw-strings';
import {useSideBarWidth} from '../api/use-tablet';
import Swiper from './Swiper';

const HEIGHT = 250;

const Container = styled(View)`
	height: ${HEIGHT + 40}px;
	overflow: hidden;
	border-bottom-width: 1px;
	border-bottom-color: rgba(0, 0, 0, 0.1);
`;

const FakeView = styled(View)`
	height: 340px;
	flex: 1;
	align-self: center;
`;

const Space = styled(View)`
	background-color: ${darken(0.05, '#fff')};
	height: 40px;
	position: absolute;
`;

const Label = styled(Text)`
	font-weight: bold;
	margin-top: 15px;
	font-size: 16px;
`;

const Logo = styled(Image)`
	width: 30px;
	height: 30px;
	margin-right: 10px;
	border-radius: 15px;
	margin-top: 15px;
`;

const LogoContainer = styled(View)`
	justify-content: center;
	flex-direction: row;
	align-items: center;
`;

type Props = {
	institution: Institution;
	onChange: (uni: Institution) => void;
};

export const ZurichAnimation = (props: Props) => {
	const width = useSideBarWidth();
	const ratio = width < 380 ? 0.17 : 0.2;

	const UZH_POSITION = [1230, 1880];
	const ETH_POSITION = [3170, 950];

	const MarginTopUZHInFrame = 0 + UZH_POSITION[1] * ratio - HEIGHT / 2;
	const MarginLeftUZHInFrame = 0 + UZH_POSITION[0] * ratio - width / 2;

	const MarginTopETHInFrame = 0 + ETH_POSITION[1] * ratio - HEIGHT / 2;
	const MarginLeftETHInFrame = 0 + ETH_POSITION[0] * ratio - width / 2;
	const language = useLanguage();
	const progress = new Animated.Value(
		Number(props.institution === ETH) * width
	);
	const appearance = useAppearance();

	return (
		<Container style={{backgroundColor: appearance.BASE_COLOR}}>
			<Space />
			<Animated.Image
				// @ts-expect-error
				pointerEvents="none"
				source={
					Platform.OS === 'ios'
						? require('../assets/zurich-unis.ios.png')
						: require('../assets/zurich-unis.android.png')
				}
				style={{
					width: 4500 * ratio,
					height: 3000 * ratio,
					position: 'absolute',
					top: 40,
					transform: [
						{
							translateY: Animated.divide(progress, width).interpolate({
								inputRange: [0, 1],
								outputRange: [0 - MarginTopUZHInFrame, 0 - MarginTopETHInFrame],
							}),
						},
						{
							translateX: Animated.divide(progress, width).interpolate({
								inputRange: [0, 1],
								outputRange: [
									0 - MarginLeftUZHInFrame,
									0 - MarginLeftETHInFrame,
								],
							}),
						},
					],
				}}
			/>
			<Swiper
				bounces
				removeClippedSubviews={false}
				automaticallyAdjustContentInsets
				loop={false}
				_height={HEIGHT}
				scrollEventThrottle={1}
				index={Number(props.institution === ETH)}
				onScroll={Animated.event(
					[
						{
							nativeEvent: {contentOffset: {x: progress}},
						},
					],
					{
						useNativeDriver: true,
					}
				)}
				onIndexChanged={(index: number) => {
					props.onChange([UZH, ETH][index] as Institution);
				}}
				paginationStyle={{
					marginBottom: -20,
					backgroundColor: appearance.BACKGROUND,
					width: 40,
					alignSelf: 'center',
					justifyContent: 'center',
					flex: 1,
					left: '50%',
					marginLeft: -20,
					padding: 2,
					borderRadius: 13,
					borderColor: appearance.BORDER_COLOR,
					borderWidth: 1,
				}}
				dotStyle={{
					width: 6,
					height: 6,
					backgroundColor: appearance.BORDER_COLOR,
				}}
				activeDotStyle={{width: 6, height: 6}}
				activeDotColor={appearance.SUBTITLE}
			>
				<FakeView>
					<LogoContainer>
						<Logo
							style={{
								tintColor: appearance.UZH_LOGO_TINT_COLOR,
							}}
							source={require('../assets/uzh-logo.png')}
						/>
						<Label style={{color: appearance.TITLE}}>
							{rawStrings.UZH[language]}
						</Label>
					</LogoContainer>
				</FakeView>
				<FakeView>
					<LogoContainer>
						<Logo source={require('../assets/eth-logo.png')} />
						<Label style={{color: appearance.TITLE}}>
							{rawStrings.ETH[language]}
						</Label>
					</LogoContainer>
				</FakeView>
			</Swiper>
		</Container>
	);
};
