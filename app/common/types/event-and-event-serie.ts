import {Institution} from '../../../core/models/credit';
import {
	EventSerieWithEventsAndPeople,
	EventType,
} from '../../../core/types/schedule';

export type EventAndEventSerie = {
	event: EventType;
	eventSerie: EventSerieWithEventsAndPeople;
	uni_identifier: string;
	number: number;
	university: Institution;
};
