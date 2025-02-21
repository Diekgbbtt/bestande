import format from 'date-fns/format';
import isValid from 'date-fns/isValid';
import React, {useCallback} from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {humanWeekday} from '../../functions/human-weekday';
import {globalStyles} from '../../functions/styles';
import {truthy} from '../../functions/truthy';
import {mapToUniSlug} from '../../functions/uni-slug';
import {useLanguage} from '../../functions/use-language';
import {useNavigationInNative} from '../../functions/useNavigationInNative';
import {periodToString} from '../../functions/uzh-period';
import {Institution} from '../../models/credit';
import rawStrings from '../../raw-strings';
import {EventType} from '../../types/schedule';
import {Row} from '../Primitives';
import {SafeSideSpace} from '../SafeSideSpace';
import {UniversalLink} from '../UniversalLink';

const Container = styled(View)`
	padding-left: 10px;
	padding-right: 10px;
	padding-top: 6px;
	padding-bottom: 6px;
`;

const RoomLabel = styled(Text)`
	color: ${(props) => props.theme.SUBTITLE};
`;

const RoomLabelExtension = styled(Text)`
	color: ${(props) => props.theme.SUBTITLE};
	opacity: 0.5;
`;

const DayFixed = styled(Text)`
	color: ${(props) => props.theme.TITLE};
	width: 25px;
`;

const DateFixed = styled(Text)`
	color: ${(props) => props.theme.TITLE};
	width: 70px;
	padding-right: 10px;
	text-align: right;
`;
const Time = styled(Text)`
	color: ${(props) => props.theme.TITLE};
`;

const NumberFixed = styled(Text)`
	width: 25px;
	color: ${(props) => props.theme.SUBTITLE};
`;

const addPadding = (minutes: number) => {
	if (minutes < 10) {
		return '0' + minutes;
	}

	return String(minutes);
};

const getTime = (_date: string | number | Date) => {
	const date = new Date(_date);
	return addPadding(date.getHours()) + ':' + addPadding(date.getMinutes());
};

export const TimetableEventSerieEvent: React.FC<{
	eventSerieEvent: EventType;
	index: number;
	institution: Institution;
}> = ({eventSerieEvent, institution, index}) => {
	const language = useLanguage();
	const start_date = eventSerieEvent.start_date
		? getTime(eventSerieEvent.start_date)
		: null;
	const end_date = eventSerieEvent.end_date
		? getTime(eventSerieEvent.end_date)
		: null;
	const navigation = useNavigationInNative();

	const onPress = useCallback(() => {
		navigation.navigate('EventDetailView', {
			uni_identifier: eventSerieEvent.id as string,
			unislug: mapToUniSlug(institution),
			number: index + 1,
			eventserieid: eventSerieEvent.event_serie_id as string,
			semester: periodToString(eventSerieEvent.period),
		});
	}, [
		eventSerieEvent.event_serie_id,
		eventSerieEvent.id,
		eventSerieEvent.period,
		index,
		institution,
		navigation,
	]);

	return (
		<SafeSideSpace>
			<UniversalLink webLink={null} nativeOnPress={onPress}>
				<Container>
					<Row>
						<NumberFixed>{index + 1}</NumberFixed>
						<DayFixed>
							{isValid(new Date(eventSerieEvent.start_date as Date))
								? humanWeekday(
										new Date(eventSerieEvent.start_date as Date).getDay() - 1,
										'de'
								  ).substr(0, 2)
								: null}
						</DayFixed>
						<DateFixed>
							{eventSerieEvent.start_date
								? format(new Date(eventSerieEvent.start_date), 'dd.MM.yy')
								: null}
						</DateFixed>
						<Time>{[start_date, end_date].filter(truthy).join('-')}</Time>
						<View style={globalStyles.flex1} />
						{eventSerieEvent.rooms ? (
							<>
								{eventSerieEvent.rooms.length > 0 ? (
									<RoomLabel>{eventSerieEvent.rooms[0].name}</RoomLabel>
								) : (
									<RoomLabel>{rawStrings.NO_ROOM[language]}</RoomLabel>
								)}
								{eventSerieEvent.rooms.length > 1 ? (
									<RoomLabelExtension>
										{' '}
										+{eventSerieEvent.rooms.length - 1}
									</RoomLabelExtension>
								) : null}
							</>
						) : null}
					</Row>
				</Container>
			</UniversalLink>
		</SafeSideSpace>
	);
};
