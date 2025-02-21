import {Building} from '../data/uzh-buildings';
import {Institution} from '../models/credit';
import {ModuleType} from '../models/module-type';
import {ImageType} from './image';
import {ExpandedExamReturnStatistic, ImageSize} from './types';

export type ScheduleApiResponse = {
	version: number;
	data: EventSerieWithEventsAndPeople[];
	gradesOut: ExpandedExamReturnStatistic | null;
};

type SingleScheduleState = {
	loading: boolean;
	schedule: ScheduleApiResponse | null;
	error: Error | null;
};

export type ScheduleState = {[key: string]: SingleScheduleState};

export type RawPerson = {
	title?: string;
	first_name?: string;
	last_name?: string;
	name: string;
	university: Institution;
	uni_identifier: string;
	image?: ImageType;
	header_image?: ImageType;
	_id?: string;
	titles?: string;
	email?: string;
};

export type RoomType = {
	university: Institution;
	name: string;
	id: string;
	location?: {
		longitude: number;
		latitude: number;
	} | null;
	plan: string | null;
	plan_dimensions: ImageSize | null;
	subtitle: string | null;
	campus: string | null;
	building: Building | null;
	address?: string;
};

export type EventType = {
	_id?: string;
	university: Institution;
	event_serie_id: string | null;
	id?: string;
	period: number;
	start_date: string | Date | null;
	end_date: string | Date | null;
	rooms: RoomType[];
	smart?: boolean;
	comments?: string | null;
	eth_exam_type?: 'written' | 'oral' | null;
	eth_exam_helpers?: string | null;
	eth_personal_examinator?: string[];
};

export type EventSerieType = {
	category: ModuleType;
	time_label: string | null;
	id: string | null;
	comments: string | null;
	people: string[];
	smart?: boolean;
	roomIds?: string[];
	startTimeIds?: string[];
};

export type EventSerieWithEvents = EventSerieType & {
	events: EventType[];
};

export type EventSerieWithEventsAndPeople = Omit<
	EventSerieWithEvents,
	'people'
> & {
	people: RawPerson[];
};

export type Schedule = EventSerieWithEventsAndPeople[];

export type EventSerieMap = {
	roomIds: string[];
	category: ModuleType;
	id: string | null;
	startTimeIds: [string, string][];
	people?: string[];
	comments: string | null;
};
