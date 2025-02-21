import flatten from 'lodash/flatten';
import uniqBy from 'lodash/uniqBy';
import {Institution} from '../../../core/models/credit';
import {SESSION_EXAM} from '../../../core/models/exam-form';
import {
	COLLOQUIUM,
	COURSE,
	EXERCISES,
	INDEPENDENT_STUDY,
	LECTURE_AND_EXERCISES,
	ModuleType,
} from '../../../core/models/module-type';
import Room from '../../../core/models/room';
import Semester from '../../../core/models/semester';
import {ETH} from '../../../core/models/university';
import {
	getDates,
	getEvents,
	getIdsFromPage,
	makeModuleFromHtml,
	makePersonFromEthHtml,
	makeRoomFromHtml,
	makeSemesterFromHtml,
} from '../../src/tasks/eth-converter';
import {
	fetchDepartmentPage,
	fetchModule,
	fetchPerson,
	fetchRoom,
} from '../../src/tasks/fetch-eth';
import {test} from '../helpers/_test-with-context';

const context: {
	module113376?: string;
	module115804?: string;
	module119418?: string;
	module117351?: string;
	module111678?: string;
	module116351?: string;
	module117147?: string;
	module117370?: string;
	module118225?: string;
	module121279?: string;
	module120715?: string;
	module121149?: string;
	module124659?: string;
	semester121279?: Semester;
} = {};

test.before(async () => {
	const [
		module113376,
		module115804,
		module119418,
		module117351,
		module111678,
		module116351,
		module117147,
		module117370,
		module118225,
		module121279,
		module120715,
		module121149,
		module124659,
	] = await Promise.all<string>([
		fetchModule('113376', '2017S', true),
		fetchModule('115804', '2017W', true),
		fetchModule('119418', '2017W', true),
		fetchModule('117351', '2017W', true),
		fetchModule('111678', '2017S', true),
		fetchModule('116351', '2017W', true),
		fetchModule('117147', '2017W', true),
		fetchModule('117370', '2017W', true),
		fetchModule('118225', '2017W', true),
		fetchModule('121279', '2018S', true),
		fetchModule('120715', '2018S', true),
		fetchModule('121149', '2018S', true),
		fetchModule('124659', '2018W', true),
	]);
	Object.assign(context, {
		module113376,
		module115804,
		module119418,
		module117351,
		module111678,
		module116351,
		module117147,
		module117370,
		module118225,
		module121279,
		module120715,
		module121149,
		module124659,
	});
	context.semester121279 = await makeSemesterFromHtml('2018S', module121279);
});

test('Should make module from HTML', (t) => {
	const result = context.module113376;
	const module = makeModuleFromHtml(result as string);
	t.is(module.name, 'Chemie II');
	t.is(module.uni_identifier, '529-2002-02L');
});

test('Should recognize lecture and exercises', (t) => {
	const result = context.module115804;
	const module = makeModuleFromHtml(result as string);
	t.is(module.type, LECTURE_AND_EXERCISES);
});

test('Should recognize independent study', (t) => {
	const result = context.module119418;
	const module = makeModuleFromHtml(result as string);
	t.is(module.type, INDEPENDENT_STUDY);
});

test('Should recognize colloquium', (t) => {
	const result = context.module117351;
	const module = makeModuleFromHtml(result as string);
	t.is(module.type, COLLOQUIUM);
});

test('Should parse credits correctly', async (t) => {
	const result = context.module111678;
	const semester = await makeSemesterFromHtml('2017S', result as string);
	t.is(semester.credits, 2);
	t.is(semester.period, 20171);
});

test('Should parse person correctly', async (t) => {
	const result = context.module111678;
	const semester = await makeSemesterFromHtml('2017S', result as string);
	const people = await Promise.all(
		semester.instructors.map((r) => {
			return fetchPerson(r.id, '2017S', true);
		})
	);
	const peopleObjs = people.map((html) =>
		makePersonFromEthHtml(semester.instructors[0].id, html.toString())
	);
	t.is(peopleObjs[0].name, 'Isabel Günther');
	t.is(peopleObjs[0].titles, 'Frau Prof. Dr.');
	t.is(peopleObjs[0].uni_identifier, semester.instructors[0].id);
});

test('Should parse event series correctly', async (t) => {
	const result = context.module113376;
	const {event_series} = await makeSemesterFromHtml('2017S', result as string);

	t.deepEqual(event_series[0], {
		category: 'COURSE',
		id: '1288042-0',
		time_label: 'Mo, 14:45-16:30',
		people: ['10003137', '10003531'],
		comments: null,
	});

	t.deepEqual(event_series[1], {
		category: 'COURSE',
		id: '1288042-1',
		time_label: '22.06., 10:15-13:00',
		people: ['10003137', '10003531'],
		comments: null,
	});

	t.deepEqual(event_series[3], {
		category: 'EXERCISES',
		id: '1287877-0',
		time_label: 'Di, 08:15-10:00',
		people: [
			'10003137',
			'10004979',
			'10039922',
			'10002929',
			'10003531',
			'10002544',
			'10032923',
		],
		comments:
			'Dienstag 8-10 für den Studiengang Umweltnaturwissenschaften\nDienstag 13-15 für den Studiengang Umweltingenieurwissenschaften\nMittwoch 8-10 für den Studiengang Erdwissenschaften\nDonnerstag 13-15 für die Studiengänge Agrar- und Lebensmittelwissenschaften',
	});
});

test('Event series case', async (t) => {
	const result = context.module124659;
	const {event_series} = await makeSemesterFromHtml('2018W', result as string);
	t.deepEqual(event_series[4].time_label, 'Mi, 10:15-11:55');
});

test('Should be able to create events', async (t) => {
	const result = context.module113376;
	const events = await getEvents('2017S', result as string);

	t.deepEqual(events[0][0], {
		university: ETH,
		event_serie_id: '1288042-0',
		id: '1',
		period: 20171,
		start_date: new Date('2017-02-20 13:45 UTC'),
		end_date: new Date('2017-02-20 15:30 UTC'),
		rooms: [
			{
				building: null,
				campus: null,
				plan: null,
				plan_dimensions: null,
				subtitle: null,
				university: ETH as Institution,
				name: 'HPH G 1',
				id: 'HPH-G-1',
			},
		],
	});
	t.deepEqual(events[3][0], {
		university: ETH,
		event_serie_id: '1287877-0',
		id: '1',
		period: 20171,
		start_date: new Date('2017-02-21 07:15 UTC'),
		end_date: new Date('2017-02-21 09:00 UTC'),
		rooms: [
			{
				university: ETH as Institution,
				name: 'CAB G 51',
				id: 'CAB-G-51',
				plan: null,
				plan_dimensions: null,
				subtitle: null,
				campus: null,
				building: null,
			},
			{
				university: ETH as Institution,
				name: 'HG D 5.2',
				id: 'HG-D-5.2',
				plan: null,
				plan_dimensions: null,
				subtitle: null,
				campus: null,
				building: null,
			},
			{
				university: ETH as Institution,
				name: 'HG D 7.2',
				id: 'HG-D-7.2',
				plan: null,
				plan_dimensions: null,
				subtitle: null,
				campus: null,
				building: null,
			},
		],
	});
});

test('Should be able to create events #2', async (t) => {
	const result = context.module121149;
	const events = await getEvents('2018S', result as string);
	t.deepEqual(events[3][0], {
		university: ETH,
		event_serie_id: '1309562-3',
		id: '1',
		rooms: [
			{
				id: 'ETZ-E-8',
				name: 'ETZ E 8',
				university: ETH as Institution,
				plan: null,
				plan_dimensions: null,
				subtitle: null,
				campus: null,
				building: null,
			},
		],
		period: 20181,
		start_date: new Date('2018-05-03 8:15 UTC'),
		end_date: new Date('2018-05-03 12:00 UTC'),
	});
});

test('Should handle no events correctly', async (t) => {
	const result = context.module116351;
	const semester = await makeSemesterFromHtml('2017W', result as string);
	t.deepEqual(semester.event_series, [
		{
			category: 'LECTURE_AND_EXERCISES' as ModuleType,
			comments: semester.event_series?.[0]?.comments ?? null,
			id: null,
			people: ['10008994'],
			roomIds: [],
			time_label: null,
			startTimeIds: [],
		},
	]);
});

test('Should parse dates correctly', (t) => {
	const dates = getDates(
		'25.09.; 02.10.; 09.10.; 16.10.; 23.10.; 30.10.; 06.11.; 13.11.; 20.11.; 27.11.; 04.12.; 11.12.; 18.12.; 01.02.; 03.02.',
		2017
	);
	t.deepEqual(dates, [
		new Date('2017-09-25'),
		new Date('2017-10-02'),
		new Date('2017-10-09'),
		new Date('2017-10-16'),
		new Date('2017-10-23'),
		new Date('2017-10-30'),
		new Date('2017-11-06'),
		new Date('2017-11-13'),
		new Date('2017-11-20'),
		new Date('2017-11-27'),
		new Date('2017-12-04'),
		new Date('2017-12-11'),
		new Date('2017-12-18'),
		new Date('2018-02-01'),
		new Date('2018-02-03'),
	]);

	// Times should be ignored and be fetched from the main listing
	// In this example it actually starts at 10:15
	const datesWithTime = getDates('22.06. 10:00 - 13:00', 2017);
	t.deepEqual(datesWithTime, [new Date('2017-06-22')]);
});

test('Should be able to process weird modules 1', async (t) => {
	const result = context.module117147;
	await makeSemesterFromHtml('2017W', result as string);
	t.pass();
});

test('Should be able to process weird modules 2', async (t) => {
	const result = context.module118225;
	await makeSemesterFromHtml('2017W', result as string);
	t.pass();
});

test.skip('Should be able to make room', async (t) => {
	const result = await fetchRoom('HG-E-1.1');
	const room = await makeRoomFromHtml('HG-E-1.1', result as string);
	t.deepEqual(
		room,
		new Room({
			address: 'Rämistrasse 101, 8092 Zürich',
			university: ETH,
			name: 'HG E 1.1',
			id: 'HG-E-1.1',
			plan_dimensions: {
				width: 2939,
				height: 2041,
			},
			plan:
				'http://www.rauminfo.ethz.ch/Rauminfo/grundrissplan.gif?gebaeude=HG&geschoss=E&raumNr=1.1&lang=de',
			location: {
				longitude: 8.547995,
				latitude: 47.37642,
			},
		})
	);
});

test('Should be able to fetch IDs for departments', async (t) => {
	const {body} = await fetchDepartmentPage('2017W', '1');
	const parsed = getIdsFromPage(body.toString());
	t.true(parsed.length > 5);
	t.true(
		parsed.every((p) => {
			return p.startsWith('052');
		})
	);
	t.true(
		parsed.every((p) => {
			return p.endsWith('L');
		})
	);
});

test('Get room from UZH redirect', async (t) => {
	const result = await fetchRoom('I17-M-5');
	const room = await makeRoomFromHtml('I17-M-5', result as string);
	t.deepEqual(room.location, {
		longitude: 8.55055,
		latitude: 47.397274,
	});
});

test('Should not get event duplicated', async (t) => {
	const result = context.module117370;
	const events = flatten(await getEvents('2017W', result as string));
	t.is(
		events.length,
		uniqBy(events, (e) => String(e.id) + e.event_serie_id).length
	);
});

test('Should avoid no-deconstructing error', async (t) => {
	const result = await fetchModule('109785', '2016W', true);
	t.notThrows(() => getEvents('2016W', result as string));
});

test('Should parse Instructors correctly', (t) => {
	const semester = context.semester121279;
	t.deepEqual(semester?.instructors, [
		{
			id: '10003137',
			important: true,
			type: [COURSE, EXERCISES],
		},
		{
			id: '10004979',
			important: false,
			type: [EXERCISES],
		},
		{
			id: '10039922',
			important: false,
			type: [EXERCISES],
		},
		{id: '10002929', important: false, type: [EXERCISES]},
		{id: '10003531', important: false, type: [EXERCISES]},
		{id: '10002544', important: false, type: [EXERCISES]},
		{id: '10032923', important: false, type: [EXERCISES]},
	]);
});

test('Should parse credits and bundles correctly', async (t) => {
	const result = context.module117370;
	const semester = await makeSemesterFromHtml('2017W', result as string);
	const semester2 = context.semester121279;

	t.deepEqual(semester.assessment, [
		{
			additional_exam_mode_info_eth: '',
			attendance_confirmation_required: '',
			exam_allowed_helpers_written_eth: '',
			exam_form: 'NO_DATA',
			exam_language: '',
			exam_mode_eth: '',
			repeatability_eth: '',
			combination: [
				{university: ETH as Institution, uni_identifier: '529-2002-02L'},
			],
			credits: 9,
			studies: [
				'Bachelor-Studiengang Agrarwissenschaft 2010; Ausgabe 13.10.2015 (Prüfungsblock)',
				'Bachelor-Studiengang Agrarwissenschaften 2015; Ausgabe 01.03.2019 (Prüfungsblock)',
				'Bachelor-Studiengang Erdwissenschaften 2010; Ausgabe 24.02.2016 (Prüfungsblock)',
				'Bachelor-Studiengang Erdwissenschaften 2016 (Prüfungsblock)',
				'Bachelor-Studiengang Lebensmittelwissenschaft 2010; Ausgabe 22.03.2016 (Prüfungsblock)',
				'Bachelor-Studiengang Lebensmittelwissenschaften 2016; Ausgabe 06.03.2019 (Prüfungsblock)',
				'Bachelor-Studiengang Umweltingenieurwissenschaften 2010; Ausgabe 29.10.2013 (Prüfungsblock)',
				'Bachelor-Studiengang Umweltingenieurwissenschaften 2010; Ausgabe 07.03.2018 (Prüfungsblock)',
				'Bachelor-Studiengang Umweltnaturwissenschaften 2011; Ausgabe 12.01.2016 (Prüfungsblock)',
				'Bachelor-Studiengang Umweltnaturwissenschaften 2016; Ausgabe 27.09.2019 (Prüfungsblock)',
			],
			examiners: [
				{
					id: '10003137',
					important: true,
				},
				{
					id: '10004979',
					important: false,
				},
				{
					id: '10039922',
					important: false,
				},
				{id: '10002929', important: false},
				{id: '10002544', important: false},
				{id: '10032923', important: false},
			],
		},
		{
			combination: [],
			credits: 4,
			exam_form: SESSION_EXAM,
			exam_language: 'Deutsch',
			attendance_confirmation_required: '',
			studies: null,
			exam_mode_eth: 'schriftlich 90 Minuten',
			additional_exam_mode_info_eth:
				'Wird in der Regel nur als Jahreskurs zusammen mit Chemie II geprüft',
			exam_allowed_helpers_written_eth:
				'Zusammenfassung: 3 A4-Seiten, einseitig, handgeschrieben, Periodensystem, Taschenrechner (nicht programmierbar / nicht kommunikationsfähig)',
			repeatability_eth:
				'Die Leistungskontrolle wird in jeder Session angeboten. Die Repetition ist ohne erneute Belegung der Lerneinheit möglich.',
			examiners: [
				{
					id: '10003137',
					important: true,
				},
				{
					id: '10004979',
					important: false,
				},
				{
					id: '10039922',
					important: false,
				},
				{id: '10002929', important: false},
				{id: '10002544', important: false},
				{id: '10032923', important: false},
			],
		},
	]);

	t.deepEqual(semester2?.assessment, [
		{
			combination: [{university: ETH, uni_identifier: '529-2001-02L'}],
			credits: 9,
			exam_form: SESSION_EXAM,
			exam_language: 'Deutsch',
			attendance_confirmation_required: '',
			exam_allowed_helpers_written_eth:
				'Zusammenfassung: 6 A4-Seiten, einseitig, handgeschrieben, Periodensystem, Taschenrechner (nicht programmierbar, nicht kommunikationsfähig)',
			additional_exam_mode_info_eth:
				'Wird in der Regel nur als Jahreskurs zusammen mit Chemie I geprüft',
			exam_mode_eth: 'schriftlich 180 Minuten',
			repeatability_eth:
				'Die Leistungskontrolle wird in jeder Session angeboten. Die Repetition ist ohne erneute Belegung der Lerneinheit möglich.',
			studies: [
				'Bachelor-Studiengang Agrarwissenschaft 2010; Ausgabe 13.10.2015 (Prüfungsblock)',
				'Bachelor-Studiengang Agrarwissenschaften 2015; Ausgabe 01.03.2019 (Prüfungsblock)',
				'Bachelor-Studiengang Erdwissenschaften 2010; Ausgabe 24.02.2016 (Prüfungsblock)',
				'Bachelor-Studiengang Erdwissenschaften 2016 (Prüfungsblock)',
				'Bachelor-Studiengang Lebensmittelwissenschaft 2010; Ausgabe 22.03.2016 (Prüfungsblock)',
				'Bachelor-Studiengang Lebensmittelwissenschaften 2016; Ausgabe 06.03.2019 (Prüfungsblock)',
				'Bachelor-Studiengang Umweltingenieurwissenschaften 2010; Ausgabe 29.10.2013 (Prüfungsblock)',
				'Bachelor-Studiengang Umweltingenieurwissenschaften 2010; Ausgabe 07.03.2018 (Prüfungsblock)',
				'Bachelor-Studiengang Umweltnaturwissenschaften 2011; Ausgabe 12.01.2016 (Prüfungsblock)',
				'Bachelor-Studiengang Umweltnaturwissenschaften 2016; Ausgabe 27.09.2019 (Prüfungsblock)',
			],
			examiners: [
				{
					id: '10003137',
					important: true,
				},
				{
					id: '10004979',
					important: false,
				},
				{
					id: '10039922',
					important: false,
				},
				{id: '10002929', important: false},
				{id: '10003531', important: false},
				{id: '10002544', important: false},
				{id: '10032923', important: false},
			],
		},
		{
			combination: [],
			credits: 5,
			exam_form: SESSION_EXAM,
			exam_language: 'Deutsch',
			additional_exam_mode_info_eth: '',
			attendance_confirmation_required: '',
			repeatability_eth:
				'Die Leistungskontrolle wird in jeder Session angeboten. Die Repetition ist ohne erneute Belegung der Lerneinheit möglich.',
			exam_mode_eth: 'schriftlich 90 Minuten',
			exam_allowed_helpers_written_eth:
				'Zusammenfassung: 3 A4-Seiten, einseitig, handgeschrieben, Periodensystem, Taschenrechner (nicht programmierbar, nicht kommunikationsfähig)',
			examiners: [
				{
					id: '10003137',
					important: true,
				},
				{
					id: '10004979',
					important: false,
				},
				{
					id: '10039922',
					important: false,
				},
				{id: '10002929', important: false},
				{id: '10003531', important: false},
				{id: '10002544', important: false},
				{id: '10032923', important: false},
			],
			studies: null,
		},
	]);
});

test('Should give seats restrictions and waiting list', async (t) => {
	const semester = await makeSemesterFromHtml(
		'2018S',
		context.module120715 as string
	);
	t.is(semester.seats_restriction, 'Maximal 30');
	t.is(semester.waiting_list, 'Bis 11.02.2018');
});

test('Should parse ILIAS link', (t) => {
	t.deepEqual(context.semester121279?.olat, {
		url:
			'https://ilias-app2.let.ethz.ch/goto.php?target=crs_143672&client_id=ilias_lda',
	});
});
