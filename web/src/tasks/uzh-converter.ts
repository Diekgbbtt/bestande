import shortName from '@jonny/uzh-course-shortname';
import flatten from 'lodash/flatten';
import flattenDeep from 'lodash/flattenDeep';
import uniqBy from 'lodash/uniqBy';
import requestImageSize from 'request-image-size';
import uzhBuildings from '../../../core/data/uzh-buildings';
import {truthy} from '../../../core/functions/truthy';
import {uzhFacultyLabel} from '../../../core/functions/uzh-faculty';
import {periodToNumber} from '../../../core/functions/uzh-period';
import Module from '../../../core/models/module';
import {
	COURSE,
	LECTURE_AND_EXERCISES,
	ModuleType,
	SEMINAR,
} from '../../../core/models/module-type';
import Room from '../../../core/models/room';
import Semester from '../../../core/models/semester';
import {UZH} from '../../../core/models/university';
import {UZHFaculty} from '../../../core/models/uzh-faculties';
import {
	Instructor,
	InstructorWithTypeArray,
} from '../../../core/types/instructor';
import {
	EventSerieType,
	EventType,
	RawPerson,
	RoomType,
} from '../../../core/types/schedule';
import {ImageSize} from '../../../core/types/types';
import {parseExam} from '../helpers/parse-exam';
import parseRoomName from '../helpers/parse-room';
import {parseGrading} from './grading';
import {mergePeople} from './merge-people';
import {uzhModuleType} from './uzh-module-type';
import {uzhRepeatability} from './uzh-repeatability';
import {makeDate} from './uzh-time-parser';

export const makeModuleFromJson = (json: any, german: any): Module => {
	const module = new Module({
		university: UZH,
		uni_identifier: json.SmObjId,
	});
	module.name = json.SmText.trim();
	module.short_name = shortName(json.SmText);
	module.faculty = uzhFacultyLabel(json.OrgText) as UZHFaculty;
	module.type = uzhModuleType(json.CategoryText);
	module.translatedNames = [
		{value: german.SmText.trim(), language: 'de' as const},
		{value: json.SmText.trim(), language: 'en' as const},
	].filter(Boolean);
	return module;
};

const makePersonFromJson = (p: any): RawPerson => {
	const {FirstName, LastName, Title, Objid} = p;
	const person = {
		university: UZH,
		uni_identifier: Objid,
		title: Title.trim(),
		first_name: FirstName.trim(),
		last_name: LastName.trim(),
		name: [Title, FirstName, LastName]
			.filter(truthy)
			.map((s: string) => s.trim())
			.join(' '),
	};
	return person;
};

export const makePeopleFromJson = (json: any): RawPerson[] => {
	const people1 = flatten(
		json.Events.results.map((e: any) => e.Persons.results)
	);
	const people2 = json.Responsible.results;
	return uniqBy([...people1, ...people2], (p) => p.Objid).map(
		makePersonFromJson
	);
};

export const makeEventSerieFromJson = (json: any): EventSerieType => {
	const people: RawPerson[] = json.Persons.results.map(makePersonFromJson);
	const eventSerie: EventSerieType = {
		category: uzhModuleType(json.CategoryText),
		time_label: json.ScheduleText,
		comments: json.EStext,
		people: people.map((p) => p.uni_identifier),
		id: json.Objid,
	};
	return eventSerie;
};

export const getBookingPeriod = (string: string): number[] | null => {
	const times = string
		.replace(/from/g, '')
		.split('to')
		.map((a) => a.trim());
	if (times.length <= 1) {
		return null;
	}

	const matches = times.map((time) => {
		return /([A-Za-z]{2}) ([0-9]{2})\.([0-9]{2})\.([0-9]{4}) ([0-9]{2}):([0-9]{2})/.exec(
			time
		);
	});
	if (!matches.every(Boolean)) {
		return null;
	}

	return matches.filter(truthy).map((match) => {
		const [, , day, month, year, hour, min] = match;
		return new Date(`${year}/${month}/${day} ${hour}:${min} (CET)`).getTime();
	});
};

const parseInstructor = (
	p: any,
	type: ModuleType,
	isFirst: boolean
): Instructor => {
	return {
		important: [
			isFirst,
			type === COURSE,
			type === LECTURE_AND_EXERCISES,
			type === SEMINAR,
		].some(Boolean),
		id: p.Objid,
		type,
	};
};

const parseInstructors = (events: any): InstructorWithTypeArray[] => {
	const flattened: Instructor[] = flattenDeep(
		events.results.map((r: any, i: number) =>
			r.Persons.results.map((p: any) =>
				parseInstructor(p, uzhModuleType(r.CategoryText), i === 0)
			)
		)
	);
	return mergePeople(flattened);
};

export const makeSemesterFromJson = (json: any): Semester => {
	const bookingText = getBookingPeriod(json.ValidText);
	const cancelText = getBookingPeriod(json.CancelText);
	const period = periodToNumber(json.PiqYear, json.PiqSession);
	const event_series: EventSerieType[] = [];
	for (const eventSerie of json.Events.results) {
		event_series.push(makeEventSerieFromJson(eventSerie));
	}

	const examParsed = parseExam({
		string: json.TestsDescription,
		uni_identifier: json.SmObjId,
		period,
		university: UZH,
	});
	if (examParsed) {
		const {eventSerie} = examParsed;

		event_series.push(eventSerie);
	}

	const semester = new Semester({
		period,
		registration_start: bookingText ? new Date(bookingText[0]) : null,
		registration_end: bookingText ? new Date(bookingText[1]) : null,
		cancellation_start: cancelText ? new Date(cancelText[0]) : null,
		cancellation_end: cancelText ? new Date(cancelText[1]) : null,
		repeatability: uzhRepeatability(json),
		credits: json.Points,
		description: json.CommonDescription,
		audience: json.AudienceDescription,
		objective: json.ObjectiveDescription,
		materials: json.MaterialDescription,
		prerecognitions: json.PrecognitionDescription,
		prerequisites: json.PrerequisitesDescription,
		test: json.TestsDescription,
		grading: parseGrading(json),
		responsible: json.Responsible.results
			.map((p: any) => makePersonFromJson(p))
			.map((p: RawPerson) => p.uni_identifier),
		instructors: parseInstructors(json.Events),
		event_series,
	});

	return semester;
};

export const makeRoomFromJson = async (json: any): Promise<RoomType> => {
	const name = json.GName || json.Name;
	const objid = json.GObjid || json.Objid;
	const building = name.substr(0, name.indexOf('-'));
	const _room = name.substr(name.indexOf('-') + 1);
	let roomDash = _room.indexOf('-');
	let roomDot = _room.indexOf('.');
	roomDash = roomDash === -1 ? Infinity : roomDash;
	roomDot = roomDot === -1 ? Infinity : roomDot;
	const floor = _room.substr(0, Math.min(roomDash, roomDot));
	const building_info = uzhBuildings.find((b) => b.code === building);
	let building_plan = building_info?.hasPlan
		? `https://www.plaene.uzh.ch/floormaps/${building}_${floor}.png`
		: null;
	let plan_dimensions: ImageSize | null = null;
	try {
		plan_dimensions = building_plan
			? await requestImageSize(building_plan)
			: null;
	} catch (err) {
		// 404 error
		building_plan = null;
	}

	const parsings = parseRoomName(name);

	const room = new Room();
	room.university = UZH;
	room.name = parsings.name;
	room.id = String(objid);
	room.plan = building_plan;
	if (parsings.subtitle) {
		room.subtitle = parsings.subtitle;
	}

	if (parsings.campus) {
		room.campus = parsings.campus;
	}

	if (plan_dimensions) {
		room.plan_dimensions = {
			width: plan_dimensions.width,
			height: plan_dimensions.height,
		};
	}

	if (json.StreetNo || json.CityPlz) {
		room.address = [json.StreetNo, json.CityPlz].filter(truthy).join('\n');
	}

	if (building_info) {
		room.location = {
			longitude: building_info.longitude,
			latitude: building_info.latitude,
		};
	} else {
		room.location = null;
	}

	return room;
};

export const makeEventFromJson = async (json: any) => {
	const promises: Promise<RoomType>[] = json.Rooms.results.map(
		makeRoomFromJson
	);
	const event: EventType = {
		university: UZH,
		event_serie_id: String(json.Objid),
		id: json.Seqnr,
		period: periodToNumber(json.PiqYear, json.PiqSession),
		start_date: makeDate(json.Evdat, json.Beguz),
		end_date: makeDate(json.Evdat, json.Enduz),
		rooms: await Promise.all(promises),
	};
	return event;
};
