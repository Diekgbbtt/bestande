import range from 'lodash/range';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {Config} from '../../../core/data/Config';
import {Colors} from '../../../core/functions/Colors';
import {useAppearance} from '../../../core/functions/use-appearance';
import rawStrings from '../../../core/raw-strings';

const Wrapper = styled(View)<{
	hasPromotions?: boolean;
}>`
	position: absolute;
	height: ${(props) =>
		(props.hasPromotions ? props.theme.promotedEventHeight : 0) + 700}px;
	left: 0;
	right: 0;
	padding-top: ${(props) =>
		props.hasPromotions ? props.theme.promotedEventHeight : 0}px;
	flex: 1;
`;

const PromotionDisclaimer = styled(View)`
	width: 70px;
	margin-top: ${(props) => -37 + props.theme.promotedEventHeight}px;
	margin-left: -13px;
	transform: rotate(-90deg);
	padding-top: 2px;
	padding-bottom: 2px;
	align-items: center;
	justify-content: center;
	background-color: ${Colors.Orange};
	position: absolute;
	border-radius: 2px;
`;

const PromotionDisclaimerText = styled(Text)`
	color: white;
	font-size: 11;
`;

export const SPACING = 55;
const MARGIN_TOP = 25;

const styles = StyleSheet.create({
	line: {
		position: 'absolute',
		borderTopWidth: 1,
		width: 2000,
		marginLeft: 32,
		overflow: 'visible',
		backgroundColor: 'transparent',
	},
	text: {
		fontSize: 10,
		width: 30,
		textAlign: 'right',
		paddingTop: 3,
		paddingBottom: 3,
		position: 'absolute',
	},
});

type Props = {
	hasPromotions: boolean;
};

export const TimeTableGrid = (props: Props) => {
	const hours = range(8, 20);
	const renderPromotionsDisclaimer = () => {
		if (!props.hasPromotions) {
			return null;
		}

		if (!Config.PROMOTED_EVENTS) {
			return false;
		}

		return (
			<PromotionDisclaimer>
				<PromotionDisclaimerText>
					{rawStrings.SPONSORED}
				</PromotionDisclaimerText>
			</PromotionDisclaimer>
		);
	};

	const appearance = useAppearance();
	return (
		<Wrapper pointerEvents="none" hasPromotions={props.hasPromotions}>
			{renderPromotionsDisclaimer()}
			{hours.map((hour) => {
				return (
					<View key={hour}>
						<View
							style={[
								styles.line,
								{
									top: (hour - 8) * SPACING + MARGIN_TOP,
									borderTopColor: appearance.BORDER_COLOR,
								},
							]}
						/>
						<Text
							style={[
								styles.text,
								{
									top: (hour - 8) * SPACING + MARGIN_TOP - 9,
									color: appearance.SUBTITLE,
								},
							]}
						>
							{hour + ':00'}
						</Text>
					</View>
				);
			})}
		</Wrapper>
	);
};
