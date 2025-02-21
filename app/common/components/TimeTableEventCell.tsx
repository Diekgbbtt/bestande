import React, {useCallback} from 'react';
import {StyleSheet, TouchableHighlight, View} from 'react-native';
import {Text} from 'react-native-normalized';
import {EventHelpers} from '../../../core/functions/EventHelpers';
import {getCredit} from '../../../core/functions/get-credit';
import renderModuleType from '../../../core/functions/render-module-type';
import {mapToUniSlug} from '../../../core/functions/uni-slug';
import {useAppState} from '../../../core/functions/use-app-state';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import {periodToString} from '../../../core/functions/uzh-period';
import {Institution} from '../../../core/models/credit';
import {
	EventSerieWithEventsAndPeople,
	EventType,
} from '../../../core/types/schedule';
import {globalNavigate} from '../api/set-master-navigator';
import {useTimetableColumnWidth} from '../api/timetable-layout';
import {SPACING} from './TimeTableGrid';

const styles = StyleSheet.create({
	text: {
		color: 'white',
		fontSize: 12,
	},
});

type Props = {
	event: EventType;
	eventSerie: EventSerieWithEventsAndPeople;
	university: Institution;
	parallels: number;
	spot: number;
	uni_identifier: string;
	number: number;
};

export const TimeTableEventCell: React.FC<Props> = ({
	event,
	eventSerie,
	parallels,
	spot,
	university,
	uni_identifier,
	number,
}) => {
	const credit = useAppState((state) =>
		getCredit(
			state,
			uni_identifier as string,
			periodToString(event.period),
			event.university
		)
	);
	const appearance = useAppearance();
	const language = useLanguage();
	const renderTime = useCallback(() => {
		if (parallels) {
			return (
				<Text style={[styles.text, {fontSize: 10}]}>
					{EventHelpers.getTime(event.start_date as Date)}-
					{EventHelpers.getTime(event.end_date as Date)}
				</Text>
			);
		}

		return (
			<Text style={styles.text}>
				{EventHelpers.getTime(event.start_date as Date)} -{' '}
				{EventHelpers.getTime(event.end_date as Date)}
			</Text>
		);
	}, [event.end_date, event.start_date, parallels]);
	const renderRoom = useCallback(() => {
		if (!event.rooms) {
			return null;
		}

		if (event.rooms.length === 0) {
			return null;
		}

		return (
			<Text ellipsizeMode="middle" numberOfLines={1} style={styles.text}>
				{event.rooms[0].name}
			</Text>
		);
	}, [event.rooms]);
	const onPress = useCallback(
		(ev: EventType) => {
			globalNavigate('EventDetailView', {
				unislug: mapToUniSlug(university),
				number,
				uni_identifier: ev.id as string,
				eventserieid: ev.event_serie_id as string,
				semester: periodToString(ev.period),
			});
		},
		[number, university]
	);
	const start_date = EventHelpers.hoursAfterTheDate(event.start_date as Date);
	const end_date = EventHelpers.hoursAfterTheDate(event.end_date as Date);

	const columnWidth = useTimetableColumnWidth();

	let width = columnWidth / (parallels + 1);
	const left = width * spot;
	const padding = spot === parallels ? 0 : 1;
	width -= padding;
	return (
		<TouchableHighlight
			onPress={() => onPress(event)}
			style={{
				backgroundColor: appearance.BLUE_TINT,
				margin: 3,
				borderRadius: 2,
				padding: 4,
				overflow: 'hidden',
				position: 'absolute',
				zIndex: 5,
				left,
				width,
				top: (start_date - 8) * SPACING,
				height: (end_date - start_date) * SPACING,
			}}
			underlayColor="#2c3e50"
		>
			<View>
				<Text ellipsizeMode="middle" numberOfLines={1} style={styles.text}>
					{event.smart ? '💡' : null}
					{credit.short_name}
				</Text>
				<Text ellipsizeMode="middle" numberOfLines={1} style={styles.text}>
					{renderModuleType(eventSerie.category, language)}
				</Text>
				{renderRoom()}
				{renderTime()}
			</View>
		</TouchableHighlight>
	);
};
