import cheerio from 'cheerio';
import addYears from 'date-fns/addYears';
import isBefore from 'date-fns/isBefore';
import {Element} from 'domhandler';
import {htmlToText} from 'html-to-text';
import flatten from 'lodash/flatten';
import min from 'lodash/min';
import moment from 'moment-timezone';
import requestImageSize from 'request-image-size';
import {normalizeWhitespace} from '../../../core/functions/normalize-whitespace';
import {truthy} from '../../../core/functions/truthy';
import {Institution} from '../../../core/models/credit';
import Module from '../../../core/models/module';
import {
	COLLOQUIUM,
	COURSE,
	EXERCISES,
	INDEPENDENT_STUDY,
	LECTURE_AND_EXERCISES,
	ModuleType,
	OTHER,
	PRACTICAL_TRAINING,
	SEMINAR,
	WORK,
} from '../../../core/models/module-type';
import Room from '../../../core/models/room';
import Semester from '../../../core/models/semester';
import {ETH} from '../../../core/models/university';
import {ServerAssessment} from '../../../core/types/assessments';
import {Instructor} from '../../../core/types/instructor';
import {PersonRaw} from '../../../core/types/people-state';
import {
	EventSerieMap,
	EventSerieType,
	EventSerieWithEvents,
	EventType,
	RawPerson,
	RoomType,
} from '../../../core/types/schedule';
import {ImageSize} from '../../../core/types/types';
import extractTitleFromName from '../helpers/extract-title-from-name';
import getEndTimeFromStartTime from '../helpers/get-eth-end-time';
import {parseExamForm} from './exam-form';
import {fetchEventSeries, fetchStartTime} from './fetch-eth';
import {mergePeople} from './merge-people';

const loadIdAndTitleFromHtml = (html: string) => {
	const $ = cheerio.load(html);
	const idAndTitle = $('#contentTop').text().trim();
	const [id, name] = idAndTitle.split('\n');
	return [id.trim(), name.trim()];
};

const getUniIdentifier = (html: string) => {
	return loadIdAndTitleFromHtml(html)[0];
};

const getName = (html: string) => {
	return loadIdAndTitleFromHtml(html)[1];
};

const getTypeFromEventSerieId = (event_serie_id: string): ModuleType => {
	const type = event_serie_id.substr(-1);
	switch (type) {
		case 'V':
			return COURSE;
		case 'G':
			return LECTURE_AND_EXERCISES;
		case 'U':
			return EXERCISES;
		case 'S':
			return SEMINAR;
		case 'K':
			return COLLOQUIUM;
		case 'P':
			return PRACTICAL_TRAINING;
		case 'A':
			return WORK;
		case 'D':
			return WORK;
		case 'R':
			return INDEPENDENT_STUDY;
		default:
			return OTHER;
	}
};

const getRowsForTableTitle = (html: string, title: string) => {
	const $ = cheerio.load(html);
	const table = $(`h3:contains(${title})`).next('table');
	return table
		.children('tbody')
		.children('tr')
		.filter((i, n) => $(n).find('td').length > 0);
};

const getEventTypes = (html: string) => {
	const rows = getRowsForTableTitle(html, 'Lehrveranstaltungen');
	return rows
		.map((i, r) => {
			return cheerio(r).find('td:first-child').eq(0).text();
		})
		.toArray()
		.map((s) => String(s).trim())
		.filter(truthy)
		.map(getTypeFromEventSerieId);
};

const getType = (html: string) => {
	const eventSeriesTypes = getEventTypes(html);
	if (
		eventSeriesTypes.includes(COURSE) &&
		eventSeriesTypes.includes(EXERCISES)
	) {
		return LECTURE_AND_EXERCISES;
	}

	return eventSeriesTypes[0];
};

const getContentForRow = (html: string, label: string): string => {
	const $ = cheerio.load(html);
	return htmlToText(
		$(`td:contains(${label})`)
			.eq(0)
			.parent('tr')
			.children('td')
			.eq(1)
			.html() as string,
		{wordwrap: null, hideLinkHrefIfSameAsText: true}
	).trim();
};

const getTextForRow = (html: string, label: string) => {
	const $ = cheerio.load(html);
	return $(`td:contains(${label})`)
		.eq(0)
		.parent('tr')
		.children('td')
		.eq(1)
		.text()
		.trim();
};

const getLinkForRow = (html: string, label: string) => {
	const $ = cheerio.load(html);
	return $(`td:contains(${label})`)
		.eq(0)
		.parent('tr')
		.children('td')
		.eq(1)
		.find('a')
		.attr('href');
};

const parseSection = (t: Element, row: string, removeNewline = false) => {
	const newlines = htmlToText(
		cheerio(t)
			.parents('tr')
			.nextUntil('tr:contains(Leistungskontrolle als)', `tr:contains(${row})`)
			.find('td')
			.eq(1)
			.html() as string,
		{
			wordwrap: null,
			hideLinkHrefIfSameAsText: true,
		}
	);
	if (removeNewline && newlines) {
		return newlines.replace(/[\r\n]+/g, '');
	}

	return newlines;
};

const getPeopleIds = (html: string): PersonRaw[] => {
	const $ = cheerio.load(html);
	const people: PersonRaw[] = [];
	const links = $('td:contains(Dozierende)')
		.eq(0)
		.parent('tr')
		.children('td')
		.eq(1)
		.find('a');
	links.each((i, a) => {
		const id = /dozide=([0-9t]+)/.exec(a.attribs.href);
		if (!id) {
			throw new Error('Could not parse ID');
		}

		people.push({
			id: id[1],
			important: cheerio(a).hasClass('emphasize'),
		});
	});
	return people;
};

const getAssessments = (html: string): ServerAssessment[] => {
	const assessments: ServerAssessment[] = [];
	cheerio
		.load(html)('b:contains(Leistungskontrolle als)')
		.each((i, t) => {
			const combinationUniIdentifier = cheerio(t)
				.text()
				.match(/([0-9]{3})-([0-9]{4})-([0-9A-Z]+)/g);
			const studies = parseSection(t, 'Für Reglement');
			const examForm = parseSection(t, 'Form');
			const creditsMatch = /([0-9.]+)\sKP/.exec(
				cheerio(t).parents('tr').nextAll('tr:contains(ECTS)').eq(0).text()
			);
			if (!creditsMatch) {
				throw new Error('Could not get credit points');
			}

			assessments.push({
				combination: combinationUniIdentifier
					? [
							{
								university: ETH,
								uni_identifier: combinationUniIdentifier[0],
							},
					  ]
					: [],
				credits: parseFloat(creditsMatch[1]),
				exam_form: parseExamForm(examForm),
				exam_language: parseSection(t, 'Prüfungssprache'),
				// Testat erforderlich
				attendance_confirmation_required: parseSection(
					t,
					'Testat erforderlich',
					true
				),
				exam_mode_eth: parseSection(t, 'Prüfungsmodus'),
				additional_exam_mode_info_eth: parseSection(
					t,
					'Zusatzinformation zum Prüfungsmodus'
				),
				exam_allowed_helpers_written_eth: parseSection(
					t,
					'Hilfsmittel schriftlich',
					true
				),
				repeatability_eth: parseSection(t, 'Repetition', true),
				studies: studies
					? // Replace non-breaking spaces
					  studies.replace(/[\u202F\u00A0]/g, ' ').split('\n')
					: null,
				examiners: getPeopleIds(html),
			});
		});
	return assessments;
};

const getPeriod = (html: string) => {
	const string = getContentForRow(html, 'Semester');
	const period = string.includes('Frühjahrssemester') ? 1 : 2;
	const match = /([0-9]{4})/.exec(string);
	if (!match) {
		throw new TypeError('Cannot match period');
	}

	const [, year] = match;
	return parseInt(year + period, 10);
};

export const makeModuleFromHtml = (html: string) => {
	const module = new Module({
		university: ETH,
		uni_identifier: getUniIdentifier(html),
	});
	module.name = getName(html);
	module.short_name = module.name;
	module.type = getType(html);
	return module;
};

const getEventSerieContainerId = (html: string | Element) => {
	const link = cheerio(html).find('a[href*=lehrveranstaltung]');
	if (link.length === 0) {
		return null;
	}

	const lehrIdMatch = link
		.eq(0)
		.attr('href')
		?.match(/lehrveranstaltungId=([0-9]+)/);
	if (!lehrIdMatch) {
		throw new TypeError('Could not find lehrveranstaltungsId');
	}

	const lehrId = lehrIdMatch[1];
	const startTimeLinks = link.parent().next('td');
	const startTimeIdsArray: [string, string][] = [];
	startTimeLinks.each((i, l) => {
		const a = cheerio(l).find('a');
		const aMatch = a.attr('href')?.match(/belegungsserieId=([0-9]+)/);
		if (!aMatch) {
			throw new Error('Could not parse belegungsserieID');
		}

		startTimeIdsArray.push([a.text(), aMatch[1]]);
	});
	const startTimeIds: [
		string,
		string
	][] = startTimeIdsArray.filter(([, _link]) => Boolean(_link));
	const links: string[] = [];
	startTimeLinks
		.next('td')
		.find('a')

		.each((i, a) => links.push(cheerio(a).attr('href') as string));
	const roomIds = links
		.filter((l) => /RauminfoPre/.exec(l))
		.map((l) => {
			const buildingMatch = /gebaeude=([.A-Z0-9]+)/.exec(l);
			const stageMatch = /geschoss=([.A-Z0-9]+)/.exec(l);
			const roomMatch = /raumNr=([A-Z0-9.]+)/.exec(l);
			return [buildingMatch, stageMatch, roomMatch]
				.map((r) => (r ? r[1] : null))
				.join(' ');
		});
	return {lehrId, startTimeIds, roomIds};
};

const makeStartTimeFromHtml = (html: string) => {
	const td = getContentForRow(html, 'Genaue Anfangszeit');
	const lineBreakPosition = td.indexOf('\n');
	return td.substr(0, lineBreakPosition);
};

export const makePersonFromEthHtml = (
	uni_identifier: string,
	html: string
): RawPerson => {
	const [name, titles] = extractTitleFromName(getContentForRow(html, 'Name'));
	const person = {
		name,
		titles,
		university: ETH as Institution,
		uni_identifier,
	};
	return person;
};

const makeEventSerieMapFromNode = (node: Element): EventSerieMap => {
	const number = cheerio(node).find('td').eq(0).text().trim();
	const comments = htmlToText(
		cheerio(node).find('td').eq(1).find('.kommentar-lv').html() as string,
		{wordwrap: null, hideLinkHrefIfSameAsText: true}
	);
	const people = cheerio(node)
		.children('td')
		.eq(4)
		.find('a')
		.toArray()
		.map((a) => {
			const match = cheerio(a)
				?.attr('href')
				?.match(/dozide=([0-9]+)/);
			return match ? match[1] : null;
		})
		.filter(truthy);

	const eventSerieData = getEventSerieContainerId(node);
	const id = eventSerieData ? eventSerieData.lehrId : null;
	const startTimeIds = eventSerieData ? eventSerieData.startTimeIds : [];
	const roomIds = eventSerieData ? eventSerieData.roomIds : [];
	return {
		category: getTypeFromEventSerieId(number),
		id,
		startTimeIds,
		roomIds,
		people,
		comments: comments || null,
	};
};

const getExactTime = (scheduleTime: string, exactStartTime: string): string => {
	const vagueEndTimeMatch = /-([0-9]+)/.exec(scheduleTime);
	// Edge case: http://vvz.ethz.ch/Vorlesungsverzeichnis/lerneinheit.view?semkez=2015W&ansicht=ALLE&lerneinheitId=101649&lang=de
	// Make end time = start time for now
	if (!vagueEndTimeMatch) {
		return `${exactStartTime}-${exactStartTime}`;
	}

	return [
		exactStartTime,
		getEndTimeFromStartTime(exactStartTime, vagueEndTimeMatch[1]),
	].join('-');
};

const getDate = (description: string) => {
	const match = /([0-9]{2})\.([0-9]{2})./.exec(description);
	if (!match) {
		throw new TypeError('Cannot parse date');
	}

	return `${match[1]}.${match[2]}.`;
};

const makeMoment = (description: string | undefined, year: number | string) => {
	if (!description) {
		return null;
	}

	const parts = /([0-9]{2}).([0-9]{2})./.exec(description);
	if (!parts) {
		throw new Error('Cannot parse description');
	}

	return new Date(`${year}-${parts[2]}-${parts[1]}`);
};

export const getDates = (
	description: string | undefined,
	year: number | string
): Date[] => {
	if (!description) {
		return [];
	}

	const dates = description.match(/([0-9]{2}\.[0-9]{2})./g);
	if (!dates) {
		throw new TypeError('Cannot parse dates');
	}

	const timestamps: Date[] = [];
	for (let i = 0; i < dates.length; i++) {
		let considered = makeMoment(dates[i], year) as Date;
		if (considered) {
			const last = timestamps[i - 1];
			if (last && isBefore(considered, last)) {
				considered = addYears(considered, 1);
			}

			timestamps.push(considered);
		}
	}

	return timestamps;
};

const makeEventSerieFromNode = (
	node: Element,
	exactTime: string,
	semester: string
) => {
	const day = cheerio(node).find('td').eq(0).text().trim();
	const periodicity = cheerio(node).find('td').eq(2).text().trim();
	const date = cheerio(node).find('td').eq(3).text().trim();
	const roomsArr = htmlToText(
		normalizeWhitespace(cheerio(node).find('td').eq(4).html() as string),
		{
			wordwrap: null,
			hideLinkHrefIfSameAsText: true,
		}
	)
		.split('\n')
		.filter(Boolean);
	const rooms = roomsArr.length;

	const dates = date.split(';').map((s) => s.trim());
	return {
		time_label: [
			periodicity === 'Durchgehend'
				? dates.map((d) => getDate(d)).join(',')
				: null,
			day,
			exactTime,
		]
			.filter(truthy)
			.join(', '),
		dates: getDates(date, semester.substr(0, 4)),
		rooms,
	};
};

const makeEventSeriesMapFromHtml = (html: string): EventSerieMap[] => {
	const table = getRowsForTableTitle(html, 'Lehrveranstaltungen');
	const eventSeriesMaps: EventSerieMap[] = [];
	table

		.each((i, tr) => eventSeriesMaps.push(makeEventSerieMapFromNode(tr)))
		.toArray();
	return eventSeriesMaps;
};

const makeEventSeriesFromHtml = ({
	info,
	html,
	startTimes,
	roomIds,
	semester,
	period,
	people,
	comments,
}: {
	info: {
		category: ModuleType;
		id: string | null;
	};
	html: string;
	startTimes: string[];
	roomIds: string[];
	semester: string;
	period: number;
	people: string[] | undefined;
	comments: string | null;
}): EventSerieWithEvents[] => {
	const table = getRowsForTableTitle(html, 'Daten der Veranstaltung');
	let roomIndex = 0;
	const eventSeries: EventSerieWithEvents[] = [];
	table.each((i, tr) => {
		const {dates, rooms, ...serieInfo} = makeEventSerieFromNode(
			tr,
			startTimes[roomIndex],
			semester
		);
		const actualRooms = roomIds.slice(roomIndex, rooms + roomIndex);
		const actualStartTimes = startTimes[roomIndex] || '';
		roomIndex += rooms;
		const eventSerie = {
			...info,
			...serieInfo,
			id: `${info.id}-${String(i)}`,
		};
		const event: EventSerieWithEvents = {
			...eventSerie,
			people: people ?? [],
			comments,
			events: dates.map(
				(d, j): EventType => ({
					university: ETH,
					event_serie_id: eventSerie.id,
					id: String(j + 1),
					rooms: actualRooms.map(
						(ri): RoomType => ({
							university: ETH,
							id: ri.replace(/\s/g, '-'),
							name: ri,
							plan: null,
							plan_dimensions: null,
							subtitle: null,
							campus: null,
							building: null,
						})
					),
					period,
					start_date:
						actualStartTimes.length > 0
							? moment
									.tz(d, 'Europe/Zurich')
									.hours(Number(actualStartTimes.substr(0, 2)))
									.minutes(Number(actualStartTimes.substr(3, 2)))
									.toDate()
							: null,
					end_date:
						actualStartTimes.length > 0
							? moment
									.tz(d, 'Europe/Zurich')
									.hours(Number(actualStartTimes.substr(6, 2)))
									.minutes(Number(actualStartTimes.substr(9, 2)))
									.toDate()
							: null,
				})
			),
		};

		eventSeries.push(event);
	});
	if (!table.length) {
		eventSeries.push({
			category: info.category,
			comments,
			people: people ?? [],
			events: [],
			time_label: null,
			id: null,
			roomIds: [],
			startTimeIds: [],
		});
	}

	return eventSeries;
};

const makeEventSeries = async (
	semester: string,
	result: string,
	period: number
): Promise<EventSerieWithEvents[]> => {
	if (!period) {
		throw new ReferenceError('No period specified');
	}

	const eventSeriesMap = makeEventSeriesMapFromHtml(result);
	const eventSeries = await Promise.all(
		eventSeriesMap.map(async (es) => {
			const eventSeriesHtml = es.id
				? await fetchEventSeries(es.id, semester)
				: null;
			const {startTimeIds, people, comments, roomIds, ...esFields} = es;
			const startTimeHtml = await Promise.all(
				startTimeIds.map(([text, link]) =>
					Promise.all([text, fetchStartTime(link, semester)])
				)
			);
			const startTimes = startTimeHtml.map(([text, html]) => {
				const startTime = makeStartTimeFromHtml(html.toString());
				return getExactTime(text, startTime);
			});
			const series = makeEventSeriesFromHtml({
				info: esFields,
				html: (eventSeriesHtml || '').toString(),
				startTimes,
				roomIds,
				semester,
				period,
				people,
				comments,
			});
			return series;
		})
	);
	return flatten(eventSeries);
};

const getEventSeries = async (
	semester: string,
	result: string
): Promise<EventSerieType[]> => {
	const period = getPeriod(result);
	const eventSeries = await makeEventSeries(semester, result, period);
	return eventSeries.map(({events, ...serie}) => serie);
};

export const getEvents = async (semester: string, result: string) => {
	const period = getPeriod(result);
	const eventSeries = await makeEventSeries(semester, result, period);
	return eventSeries.map(({events}) => events).filter(truthy);
};

export const getUniIdentifiersFromHtml = (html: string) => {
	const $ = cheerio.load(html);
	const links: string[] = [];

	$('a').each((i, a) => links.push($(a).attr('href') as string));

	return links
		.filter(truthy)
		.filter((l) => {
			return l.includes('lerneinheit.view');
		})
		.map((e) => {
			if (/semkez=2011S/.exec(e)) {
				return null;
			}

			const match = /lerneinheitId=([0-9]+)/.exec(e);
			if (!match) {
				throw new TypeError('Cannot parse lerneinheitID');
			}

			return match[1];
		})
		.filter(truthy);
};

const getInstructors = (html: string) => {
	const table = getRowsForTableTitle(html, 'Lehrveranstaltungen');
	const tables: Instructor[][] = [];
	table.each((i, t) => {
		const instructors: Instructor[] = [];
		cheerio(t)
			.find('td.dozierende')
			.find('a')
			.each((_i, a) => {
				const match = /dozide=([0-9t]+)/.exec(a.attribs.href);
				if (!match) {
					throw new Error('Could not match dozide');
				}

				instructors.push({
					id: match[1],
					important: cheerio(a).hasClass('emphasize'),
					type: getTypeFromEventSerieId(cheerio(t).find('td').eq(0).text()),
				});
			});

		tables.push(instructors);
	});
	return mergePeople(flatten(tables));
};

export const makeSemesterFromHtml = async (
	semester: string,
	html: string
): Promise<Semester> => {
	const olat = getLinkForRow(html, 'Dokumentenablage');
	const mainLink = getLinkForRow(html, 'Hauptlink');
	return new Semester({
		credits: min(getAssessments(html).map((a) => a.credits)) || null,
		period: getPeriod(html),
		description: getContentForRow(html, 'Kurzbeschreibung'),
		objective: getContentForRow(html, 'Lernziel'),
		materials: getContentForRow(html, 'Literatur'),
		prerequisites: getContentForRow(html, 'Voraussetzungen'),
		instructors: getInstructors(html),
		assessment: getAssessments(html),
		content: getContentForRow(html, 'Inhalt'),
		lecture_notes: getContentForRow(html, 'Skript'),
		comment: getContentForRow(html, 'Kommentar'),
		event_series: await getEventSeries(semester, html),
		seats_restriction: getContentForRow(html, 'Plätze'),
		waiting_list: getContentForRow(html, 'Warteliste'),
		olat: olat ? {url: olat} : null,
		links: mainLink
			? [{url: mainLink, title: getTextForRow(html, 'Hauptlink')}].filter(
					Boolean
			  )
			: null,
	});
};

const makePlanLink = (roomId: string) => {
	const query = roomId
		.split('-')
		.map((id, i) => {
			switch (i) {
				case 0:
					return `?gebaeude=${id}`;
				case 1:
					return `&geschoss=${id}`;
				case 2:
					return `&raumNr=${id}`;
				default:
					return id;
			}
		})
		.join('');
	return `http://www.rauminfo.ethz.ch/Rauminfo/grundrissplan.gif${query}&lang=de`;
};

export const getIdsFromPage = (html: string): string[] => {
	const $ = cheerio.load(html);
	const ids = $('.inside tr td.border-no:first-child');
	const _ids: string[] = [];
	ids.each((i, td) => {
		_ids.push($(td).text() as string);
	});
	return _ids;
};

export const makeRoomFromHtml = async (roomId: string, html: string) => {
	let longitude = '0';
	let latitude = '0';
	const match1 = /center\s:\s\[([0-9.]+),([0-9.]+)\]/.exec(html);
	if (match1) {
		longitude = match1[1];
		latitude = match1[2];
	}

	const match2 = /data-geo="([0-9.]+),([0-9.]+)"/.exec(html);
	if (match2) {
		longitude = match2[1];
		latitude = match2[2];
	}

	const match3 = /center:'8600\/Überlandstrasse 133'/.exec(html);
	if (match3) {
		latitude = '47.4048337';
		longitude = '8.6074779';
	}

	const match4 = /center:'8057\/Winterthurerstrasse 190'/.exec(html);
	if (match4) {
		latitude = '47.39679';
		longitude = '8.54868';
	}

	if (!longitude && !/keine Adresse/.exec(html)) {
		console.log(html);
		throw new Error('Could not parse coordinates ' + html);
	}

	const addressMatch = /alt="(.*)"/.exec(html);
	const address = addressMatch ? addressMatch[1] : null;
	let plan: string | null = makePlanLink(roomId);
	let plan_dimensions: ImageSize | null = null;
	try {
		plan_dimensions = plan ? await requestImageSize(plan) : null;
	} catch (err) {
		// 404 error
		plan = null;
	}

	return new Room({
		name: roomId.replace(/-/g, ' '),
		id: roomId,
		university: ETH,
		address,
		plan,
		location: {
			longitude: parseFloat(longitude) || null,
			latitude: parseFloat(latitude) || null,
		},
		plan_dimensions: plan_dimensions
			? {
					width: plan_dimensions.width,
					height: plan_dimensions.height,
			  }
			: null,
	});
};
