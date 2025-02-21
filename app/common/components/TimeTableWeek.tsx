import addDays from 'date-fns/addDays';
import endOfDay from 'date-fns/endOfDay';
import isBefore from 'date-fns/isBefore';
import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {EventHelpers} from '../../../core/functions/EventHelpers';
import {globalStyles} from '../../../core/functions/styles';
import {PromotionResponse} from '../../../core/models/promotion';
import {TIMETABLE_PADDING_LEFT} from '../api/timetable-layout';
import {EventAndEventSerie} from '../types/event-and-event-serie';
import {InbetweenWeeks} from './InbetweenWeeks';
import {TimeTableWeekDay} from './TimeTableWeekDay';

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		flexDirection: 'row',
		marginLeft: TIMETABLE_PADDING_LEFT,
	},
});

type Props = {
	events: EventAndEventSerie[];
	dayRange: Date[];
	promotions: PromotionResponse[];
	semester: string;
};

class TimeTableWeek extends Component<Props> {
	render() {
		const {events, promotions, dayRange, ...otherProps} = this.props;
		const rangeOfDays: Date[] = [];
		let day = endOfDay(dayRange[0]);
		const endOfEndRangeDay = endOfDay(dayRange[1]);

		while (isBefore(day, endOfEndRangeDay)) {
			rangeOfDays.push(day);
			day = addDays(day, 1);
		}

		rangeOfDays.push(dayRange[1]);
		return (
			<View style={styles.wrapper}>
				{rangeOfDays.map((d, i) => {
					const time = d;
					const promotionsToday = promotions.filter(
						(p) =>
							new Date(p.start_date).toDateString() ===
							new Date(time).toDateString()
					);
					const eventsToday = events.filter(
						(p) =>
							new Date(p.event.start_date as Date).toDateString() ===
							new Date(time).toDateString()
					);
					const isInbetweenWeekend =
						rangeOfDays[i - 1] &&
						EventHelpers.getWeek(d) !==
							EventHelpers.getWeek(rangeOfDays[i - 1]);
					return (
						<View key={d.toString()} style={globalStyles.flexedRow}>
							{isInbetweenWeekend ? <InbetweenWeeks /> : null}
							<TimeTableWeekDay
								day={d}
								events={eventsToday}
								style={{flex: 1}}
								promotions={promotionsToday}
								hasPromotionsThisWeek={promotions.length > 0}
								{...otherProps}
							/>
						</View>
					);
				})}
			</View>
		);
	}
}

export default TimeTableWeek;
