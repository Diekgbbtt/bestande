import format from 'date-fns/format';
import isSameDay from 'date-fns/isSameDay';
import min from 'lodash/min';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {Config} from '../../../core/data/Config';
import {getDateFnsLocale} from '../../../core/functions/get-date-fns-locale';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import {PromotionResponse} from '../../../core/models/promotion';
import {EventType} from '../../../core/types/schedule';
import {useTimetableColumnWidth} from '../api/timetable-layout';
import {EventAndEventSerie} from '../types/event-and-event-serie';
import {TimeTableEventCell} from './TimeTableEventCell';
import WeekDayPromotions from './WeekDayPromotions';

const Container = styled(View)<{columnWidth: number}>`
	flex: 1;
	width: ${(props) => props.columnWidth}px;
	min-width: 140px;
`;

const Wrapper = styled(View)<{
	promotions: PromotionResponse[];
}>`
	height: ${(props) =>
		700 + (props.promotions.length ? props.theme.promotedEventHeight : 0)}px;
`;

const styles = StyleSheet.create({
	today: {
		backgroundColor: 'rgba(231, 76, 60, 0.1)',
	},
});

type Props = {
	day: Date;
	events: EventAndEventSerie[];
	promotions: PromotionResponse[];
	hasPromotionsThisWeek: boolean;
	style?: any;
	semester: string;
};

const areEventsOverlapping = (event1: EventType, event2: EventType) => {
	return (
		event2 !== event1 &&
		new Date(event1.start_date as Date) < new Date(event2.end_date as Date) &&
		new Date(event1.end_date as Date) > new Date(event2.start_date as Date)
	);
};

const getParallelEvents = (event: EventType, otherEvents: EventType[]) => {
	return otherEvents.filter((otherEvent) =>
		areEventsOverlapping(event, otherEvent)
	);
};

const isToday = (day: Date) => {
	return isSameDay(day, Date.now());
};

const isSpotFree = (spot: EventType, spots: EventType[]) => {
	for (let i = 0; i < spots.length; i++) {
		const elem = spots[i];
		if (areEventsOverlapping(elem, spot)) {
			return false;
		}
	}

	return true;
};

const renderPromotions = (
	hasPromotionsThisWeek: boolean,
	promotions: PromotionResponse[]
) => {
	if (!Config.PROMOTED_EVENTS) {
		return null;
	}

	if (!hasPromotionsThisWeek) {
		return null;
	}

	return <WeekDayPromotions promotions={promotions} />;
};

const getParallelCount = (events: EventType[], event: EventType) => {
	const parallelEvents = getParallelEvents(event, events);
	const otherCounts = parallelEvents.map(
		(e) => getParallelEvents(e, events).length
	);
	return Math.min(
		parallelEvents.length,
		otherCounts.length > 0 ? (min(otherCounts) as number) : 0
	);
};

export const TimeTableWeekDay = (props: Props) => {
	const {events, day, ...otherProps} = props;
	const spots: EventType[][] = [];
	const appearance = useAppearance();
	const language = useLanguage();
	const columnWidth = useTimetableColumnWidth();
	return (
		<Container columnWidth={columnWidth}>
			<Wrapper
				style={isToday(props.day) ? styles.today : null}
				promotions={props.promotions}
			>
				<Text
					style={{
						alignSelf: 'center',
						paddingTop: 3,
						color: appearance.TITLE,
					}}
				>
					{format(props.day, 'EEEEEE, d.M.', {
						locale: getDateFnsLocale(language),
					})}
				</Text>
				{renderPromotions(props.hasPromotionsThisWeek, props.promotions)}
				<View>
					{props.events.map(
						({event, eventSerie, university, uni_identifier, number}) => {
							const sharedTime = getParallelCount(
								props.events.map((p) => p.event),
								event
							);
							let i = 0;
							let spotAllocated: number | null = null;
							while (spotAllocated === null) {
								if (!spots[i]) {
									spots[i] = [];
								}

								if (isSpotFree(event, spots[i])) {
									spots[i].push(event);
									spotAllocated = i;
								}

								i++;
							}

							return (
								<TimeTableEventCell
									key={
										(((((uni_identifier as string) +
											event.start_date) as string) + event.id) as string) +
										event.event_serie_id
									}
									number={number}
									eventSerie={eventSerie}
									event={event}
									parallels={sharedTime}
									university={university}
									uni_identifier={uni_identifier}
									spot={spotAllocated}
									{...otherProps}
								/>
							);
						}
					)}
				</View>
			</Wrapper>
		</Container>
	);
};
