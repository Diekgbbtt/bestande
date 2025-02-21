import flatten from 'lodash/flatten';
import sortBy from 'lodash/sortBy';
import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-normalized';
import {BlockTextTitle} from '../../../core/components/BlockTextTitle';
import {UnifiedProgress} from '../../../core/components/UnifiedProgress';
import {CreditHelpers} from '../../../core/functions/CreditHelpers';
import {EventHelpers} from '../../../core/functions/EventHelpers';
import {getModuleId} from '../../../core/functions/get-module-id';
import {getUniqueIdentifier} from '../../../core/functions/get-unique-identifier';
import {SeriesConfig} from '../../../core/functions/SeriesConfig';
import {globalStyles} from '../../../core/functions/styles';
import {mapToUniSlug} from '../../../core/functions/uni-slug';
import {useAppState} from '../../../core/functions/use-app-state';
import {useLanguage} from '../../../core/functions/use-language';
import {useNavigationInNative} from '../../../core/functions/useNavigationInNative';
import {periodToString} from '../../../core/functions/uzh-period';
import {AppLanguage} from '../../../core/models/app-language';
import {Credit, Institution} from '../../../core/models/credit';
import rawStrings from '../../../core/raw-strings';
import {IndividualScheduleState} from '../../../core/reducers/IndividualScheduleState';
import {reduceSchedule} from '../../../core/reducers/schedule';
import {
	EventSerieWithEventsAndPeople,
	EventType,
} from '../../../core/types/schedule';
import {SeriesConfigType} from '../../../core/types/serie-config';
import {EventAndEventSerie} from '../types/event-and-event-serie';
import {Card} from './Card';
import {CreditSemesterView} from './CreditSemester';
import {Event} from './Event';
import {ForwardArrowButton} from './ForwardArrowButton';
import {TouchableHighlight} from './TouchableHighlight';

const RenderEvent = (props: {
	event: EventType;
	institution: Institution;
	eventSerie: EventSerieWithEventsAndPeople;
	number: number;
	uni_identifier: string;
}) => {
	const navigation = useNavigationInNative();

	return (
		<TouchableHighlight
			key={props.number + String(props.event.start_date)}
			onPress={() =>
				navigation.navigate('EventDetailView', {
					unislug: mapToUniSlug(props.institution),
					number: props.number,
					uni_identifier: props.event.id as string,
					semester: periodToString(props.event.period),
					eventserieid: props.eventSerie.id as string,
				})
			}
			style={{marginTop: 3}}
		>
			<Event
				number={props.number}
				event={props.event}
				eventSerie={props.eventSerie}
				fill
			/>
		</TouchableHighlight>
	);
};

const onlyInFuture = (event: EventType) => {
	return EventHelpers.isInFuture(event.end_date);
};

const getEvents = (
	schedule: IndividualScheduleState,
	credit: Credit,
	seriesConfig: SeriesConfigType
): EventAndEventSerie[] => {
	if (
		!schedule ||
		!schedule.schedule ||
		!schedule.schedule[0] ||
		!schedule.schedule[0].events ||
		schedule.schedule[0].events.length === 0
	) {
		return [];
	}

	const config =
		seriesConfig[getUniqueIdentifier(credit, true)] ||
		SeriesConfig.getDefault(schedule.schedule);
	return flatten(
		schedule.schedule
			.filter((s) => SeriesConfig.serieIsActivated(config, s))
			.map((s): EventAndEventSerie[] => {
				return s.events.map(
					(e, i): EventAndEventSerie => {
						return {
							number: i + 1,
							event: e,
							eventSerie: s,
							uni_identifier: getModuleId(credit) as string,
							university: CreditHelpers.getInstitution(credit),
						};
					}
				);
			})
	);
};

const getEventsInFuture = (
	events: EventAndEventSerie[]
): EventAndEventSerie[] => {
	const eventsToDisplay = 1;
	return sortBy(events, (e) =>
		e.event.start_date === null ? 0 : new Date(e.event.start_date).getTime()
	)
		.filter((f) => onlyInFuture(f.event))
		.slice(0, eventsToDisplay);
};

const renderCongrats = (
	eventsInFuture: EventAndEventSerie[],
	language: AppLanguage
) => {
	const finished = eventsInFuture.length === 0;
	if (finished) {
		return (
			<Text style={{color: 'gray'}}>
				{rawStrings.CONGRATS_ALL_EVENTS[language]}
			</Text>
		);
	}

	return null;
};

export const Schedule = (props: Props) => {
	const language = useLanguage();
	const seriesConfig = useAppState((state) => state.seriesConfig);
	const moduleId = getModuleId(props.credit);
	const schedule = useAppState((state) =>
		reduceSchedule(
			state,
			moduleId,
			props.semester,
			CreditHelpers.getInstitution(props.credit)
		)
	);
	if (!schedule || schedule.loading) {
		return (
			<Card>
				<UnifiedProgress />
			</Card>
		);
	}

	const events = getEvents(schedule, props.credit, seriesConfig);
	if (events.length === 0) {
		return null;
	}

	const firstEvent = getEventsInFuture(events)[0];
	const eventsInFuture = getEventsInFuture(events);
	const headertext = firstEvent
		? `${rawStrings.NEXT_EVENT[language]}: ${EventHelpers.relativeDay(
				firstEvent.event.start_date,
				firstEvent.event.end_date,
				language
		  )}`
		: rawStrings.ALL_EVENTS_OVER[language];
	return (
		<View>
			<BlockTextTitle>{headertext}</BlockTextTitle>
			{renderCongrats(eventsInFuture, language)}
			{eventsInFuture.map((e) => {
				return (
					<RenderEvent
						key={e.event.id}
						event={e.event}
						eventSerie={e.eventSerie}
						institution={e.university}
						uni_identifier={e.uni_identifier}
						number={e.number}
					/>
				);
			})}
			<View style={{flexDirection: 'row'}}>
				{eventsInFuture.length === 0 && moduleId ? (
					<View style={globalStyles.flex1}>
						<CreditSemesterView
							credit={props.credit}
							semester={props.semester}
							moduleId={moduleId}
						>
							<ForwardArrowButton text={rawStrings.CHANGE_SEMESTER[language]} />
						</CreditSemesterView>
					</View>
				) : null}
			</View>
		</View>
	);
};

type Props = {
	semester: string;
	credit: Credit;
};
