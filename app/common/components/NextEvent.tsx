import React, {useCallback, useEffect} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Image, Text} from 'react-native-normalized';
import {useDispatch} from 'react-redux';
import styled from 'styled-components/native';
import {EventHelpers} from '../../../core/functions/EventHelpers';
import {
	EventSeriePlusEvent,
	getNextEventFromCredit,
	getSchedule,
} from '../../../core/functions/get-next-event-from-credit';
import {globalStyles} from '../../../core/functions/styles';
import {useAppState} from '../../../core/functions/use-app-state';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import {Credit} from '../../../core/models/credit';
import {EventType} from '../../../core/types/schedule';
import {getSchedule as getScheduleAction} from '../actions/schedule';
import {isCreditBooked} from '../api/is-credit-booked';
import {Button, Icon, IconContainer, Label} from './Button';
import {FactIcon} from './FactIcon';

const styles = StyleSheet.create({
	view: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 4,
	},
	boldLabel: {
		fontWeight: 'bold',
	},
});

const Chevron = styled(Image).attrs({
	source: require('../../../core/assets/collapsed.png'),
})`
	height: 16px;
	width: 16px;
`;

export const NextEvent: React.FC<{
	credit: Credit;
	semester: string;
	onClicked?: (eventInfo: EventSeriePlusEvent) => void;
	detailView: boolean;
}> = ({credit, semester, onClicked, detailView}) => {
	const appearance = useAppearance();
	const schedule = useAppState((state) =>
		getSchedule(state.schedule, credit, semester)
	);
	const language = useLanguage();
	const firstEvent = useAppState((state) =>
		getNextEventFromCredit(state.schedule, state.seriesConfig, credit, semester)
	);
	const dispatch = useDispatch();

	const isRightNow = useCallback((event: EventType) => {
		return (
			EventHelpers.isInFuture(event.end_date) &&
			!EventHelpers.isInFuture(event.start_date)
		);
	}, []);
	const renderRoomName = useCallback((event: EventType): string => {
		if (event.rooms && event.rooms.length > 0) {
			return event.rooms[0].name;
		}

		return '';
	}, []);

	const renderDetailView = useCallback(
		(eventInfo: EventSeriePlusEvent) => {
			return (
				<TouchableOpacity
					style={{padding: 12, paddingBottom: 4}}
					onPress={() => {
						if (onClicked) {
							onClicked(eventInfo);
						}
					}}
				>
					<Button color={appearance.ICON_TINT}>
						<IconContainer color={appearance.BACKGROUND}>
							<Icon
								color={appearance.ICON_TINT}
								source={require('../assets/twotone_calendar_today_black_48dp.png')}
							/>
						</IconContainer>
						<Label>
							<Text style={[styles.boldLabel, {color: appearance.SUBTITLE}]}>
								{EventHelpers.relativeDay(
									eventInfo.event.start_date,
									eventInfo.event.end_date,
									language
								)}
								,{' '}
								{EventHelpers.getTimeDescription(
									eventInfo.event.start_date as Date,
									eventInfo.event.end_date as Date,
									language
								)}
							</Text>
							<Text
								style={{
									fontWeight: 'normal',
									color: appearance.SUBTITLE,
								}}
							>
								{' '}
								{renderRoomName(eventInfo.event)}
							</Text>
						</Label>
						<View style={globalStyles.flex1} />
						<Chevron
							source={require('../../../core/assets/collapsed.png')}
							style={{tintColor: appearance.ICON_TINT}}
						/>
					</Button>
				</TouchableOpacity>
			);
		},
		[
			appearance.BACKGROUND,
			appearance.ICON_TINT,
			appearance.SUBTITLE,
			language,
			onClicked,
			renderRoomName,
		]
	);

	const fetchSchedule = useCallback(() => {
		if (!schedule.schedule && !schedule.loading && isCreditBooked(credit)) {
			dispatch(getScheduleAction(credit, semester));
		}
	}, [schedule.schedule, schedule.loading, credit, dispatch, semester]);

	useEffect(() => {
		fetchSchedule();
	}, [fetchSchedule]);

	if (isCreditBooked(credit)) {
		if (firstEvent) {
			const image = require('../assets/twotone_calendar_today_black_48dp.png');

			if (detailView) {
				return renderDetailView(firstEvent);
			}

			return (
				<View style={styles.view}>
					<FactIcon
						source={image}
						style={
							isRightNow(firstEvent.event)
								? {tintColor: appearance.BLUE_TINT}
								: {
										tintColor: appearance.ICON_TINT,
								  }
						}
					/>
					<Text
						style={[
							styles.boldLabel,
							isRightNow(firstEvent.event)
								? {color: appearance.BLUE_TINT}
								: {color: appearance.SUBTITLE},
						]}
					>
						{EventHelpers.relativeDay(
							firstEvent.event.start_date,
							firstEvent.event.end_date,
							language
						)}
						,{' '}
						{EventHelpers.getTimeDescription(
							firstEvent.event.start_date as Date,
							firstEvent.event.end_date as Date,
							language
						)}
					</Text>
					<Text
						style={
							isRightNow(firstEvent.event)
								? {color: appearance.BLUE_TINT}
								: {color: appearance.SUBTITLE}
						}
					>
						{' '}
						{renderRoomName(firstEvent.event)}
					</Text>
				</View>
			);
		}
	}

	return <View />;
};
