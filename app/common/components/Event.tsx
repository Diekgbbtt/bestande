import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-normalized';
import {EventHelpers} from '../../../core/functions/EventHelpers';
import renderModuleType from '../../../core/functions/render-module-type';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import rawStrings from '../../../core/raw-strings';
import {
	EventSerieWithEventsAndPeople,
	EventType,
	RawPerson,
	RoomType,
} from '../../../core/types/schedule';

const styles = StyleSheet.create({
	cell: {
		paddingLeft: 12,
		paddingRight: 12,
		paddingTop: 8,
		paddingBottom: 8,
		borderBottomWidth: 0,
		borderBottomColor: 'rgba(0, 0, 0, 0.1)',
	},
	subtitle: {
		flexDirection: 'row',
		marginTop: 2,
	},
	subtitleView: {
		flex: 1,
	},
});

const renderRoomName = (rooms: RoomType[]) => {
	if (rooms && rooms.length > 0) {
		return rooms[0].name;
	}

	return '';
};

const renderLecturer = (lecturers: RawPerson[]) => {
	if (!lecturers || lecturers.length === 0) {
		return null;
	}

	return lecturers[0].name;
};

export const Event = (props: {
	event: EventType;
	eventSerie: EventSerieWithEventsAndPeople;
	smart?: boolean;
	fill?: boolean;
	number: number;
}) => {
	const language = useLanguage();
	const label = renderModuleType(props.eventSerie.category, language);
	const [start_date, end_date] = [
		EventHelpers.getTime(props.event.start_date as Date),
		EventHelpers.getTime(props.event.end_date as Date),
	];
	const startdate = EventHelpers.relativeDay(
		props.event.start_date,
		props.event.end_date,
		language
	);
	const appearance = useAppearance();

	const subtitleStyle = {
		color: props.fill ? 'white' : appearance.SUBTITLE,
	};

	return (
		<View
			style={[
				styles.cell,
				{backgroundColor: appearance.BACKGROUND},
				props.fill
					? {
							backgroundColor: appearance.BLUE_TINT,
							borderRadius: 2,
					  }
					: {},
			]}
		>
			<Text
				style={{
					fontSize: 16,
					color: props.fill ? 'white' : appearance.TITLE,
				}}
			>
				{props.event.smart ? '💡 ' : null}
				{label} {props.number}
			</Text>
			<View style={styles.subtitle}>
				<View style={styles.subtitleView}>
					<Text style={subtitleStyle}>{startdate}</Text>
				</View>
				<View style={styles.subtitleView}>
					<Text style={{...subtitleStyle, textAlign: 'right'}}>
						{start_date}-{end_date}
					</Text>
				</View>
			</View>
			<View style={styles.subtitle}>
				<View style={styles.subtitleView}>
					<Text style={subtitleStyle}>
						{renderRoomName(props.event.rooms)}{' '}
						{(props.event.rooms || []).length > 1 &&
							'& ' + rawStrings.ROOMS_MORE[language]}
					</Text>
				</View>
				<View style={styles.subtitleView}>
					<Text
						style={{
							...subtitleStyle,
							textAlign: 'right',
						}}
					>
						{renderLecturer(props.eventSerie.people as RawPerson[])}
					</Text>
				</View>
			</View>
		</View>
	);
};
