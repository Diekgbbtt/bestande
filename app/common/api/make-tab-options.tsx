import React from 'react';
import {
	ImageStyle,
	ImageURISource,
	Platform,
	StyleSheet,
	View,
} from 'react-native';
import {Image, Text} from 'react-native-normalized';
import {connect} from 'react-redux';
import styled from 'styled-components/native';
import {Config} from '../../../core/data/Config';
import {Colors} from '../../../core/functions/Colors';
import {EventHelpers} from '../../../core/functions/EventHelpers';
import {AppearanceMap} from '../../../core/functions/use-appearance';
import {PROMOTED_EVENT} from '../../../core/models/promotion-type';
import {parsePromotions} from '../../../core/reducers/promotions';
import {AppState} from '../../../core/types/app-state';
import {getTimeTableData} from './timetable-data';

const Badge = styled(View)`
	position: absolute;
	background-color: ${Colors.Red};
	align-items: center;
	justify-content: center;
	margin-left: 16px;
	margin-top: ${Platform.OS === 'android' ? 7 : 16}px;
	padding-left: 4px;
	padding-right: 4px;
	border-radius: 6px;
`;

const BadgeLabel = styled(Text)`
	color: white;
	background-color: transparent;
	font-size: 11px;
	font-weight: bold;
`;

const styles = StyleSheet.create({
	icon: {
		width: 26,
		height: 26,
		marginTop: Platform.OS === 'android' ? 2 : 0,
	},
});

const IconWithBadge = ({
	icon,
	tintColor,
	badgeCount,
	promotionBadge,
	adjustments,
}: {
	icon: ImageURISource;
	tintColor: string;
	badgeCount: number;
	promotionBadge?: boolean;
	adjustments?: ImageStyle;
}) => {
	return (
		<View>
			<Image source={icon} style={[styles.icon, {tintColor}, adjustments]} />
			{Config.PROMOTED_EVENTS && promotionBadge && badgeCount > 0 ? (
				<Badge>
					<BadgeLabel>{badgeCount}</BadgeLabel>
				</Badge>
			) : null}
		</View>
	);
};

const IconWithBadgeConnected = connect((state: AppState) => {
	if (state.promotions.hideBadge) {
		return {
			badgeCount: 0,
		};
	}

	const promotions = parsePromotions(state.promotions).filter(
		(p) => p.type === PROMOTED_EVENT
	);
	const {currentWeek, semester} = getTimeTableData(state);
	const week = state.timetable.weeks[semester] || currentWeek;
	const dayRange = EventHelpers.getDayRange(week);
	const promotionsThisWeek = promotions.filter((p) =>
		EventHelpers.eventIsInDayRange(p, dayRange)
	);
	return {
		badgeCount: promotionsThisWeek.length,
	};
})(IconWithBadge);

export const makeTabOptions = (
	icon: ImageURISource,
	{
		promotionBadge = false,
		adjustments = {},
	}: {
		promotionBadge?: boolean;
		adjustments?: ImageStyle;
	} = {},
	appearanceMap: AppearanceMap
) => {
	return {
		tabBarLabel: () => <View />,
		tabBarIcon: ({focused}: {focused: boolean}) => {
			return (
				<IconWithBadgeConnected
					icon={icon}
					adjustments={adjustments}
					tintColor={
						focused ? appearanceMap.BLUE_TINT : appearanceMap.TABBAR_ICONTINT
					}
					promotionBadge={promotionBadge}
				/>
			);
		},
		backBehavior: 'none',
	};
};
