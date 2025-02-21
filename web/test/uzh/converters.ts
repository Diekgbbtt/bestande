import ms from 'ms';
import {truthy} from '../../../core/functions/truthy';
import {
	humanToPeriod,
	periodToString,
} from '../../../core/functions/uzh-period';
import {UZH_WWF} from '../../../core/models/repeatability';
import {fetchModule} from '../../src/tasks/fetch-uzh';
import {
	getBookingPeriod,
	makeEventFromJson,
	makeEventSerieFromJson,
	makeModuleFromJson,
	makeRoomFromJson,
	makeSemesterFromJson,
} from '../../src/tasks/uzh-converter';
import {
	makeDate,
	parseUzhDate,
	parseUzhTime,
} from '../../src/tasks/uzh-time-parser';
import {test} from '../helpers/_test-with-context';
import eventJson from './_event';
import eventSerieJson from './_event-serie';
import roomJson from './_room';

test('Should convert to Module from JSON', async (t) => {
	const json = await fetchModule(50491823, 2018, '003', 'en');
	const germanJson = await fetchModule(50491823, 2018, '003', 'de');
	const module = makeModuleFromJson(json, germanJson);
	t.regex(module.name as string, /Auditing/);
});

test('Should convert to Semester from JSON', async (t) => {
	const json = await fetchModule(50491823, 2018, '003', 'en');
	const semester = makeSemesterFromJson(json);
	t.true(semester.registration_start instanceof Date);
	t.true(isFinite(Number(semester.registration_start)));
	t.is(semester.repeatability, UZH_WWF);
});

test.skip('Should convert room JSON to room', async (t) => {
	const result = await makeRoomFromJson(roomJson);
	t.is(result.name, 'KOL-F-118');
	t.is(result.id, '49000437');
	t.is(result.location?.longitude, 8.54861294);
	t.is(result.plan, 'https://www.plaene.uzh.ch/floormaps/KOL_F.png');
	t.deepEqual(result.plan_dimensions, {width: 551, height: 710});
});

test('Should convert event serie JSON to room', (t) => {
	const result = makeEventSerieFromJson(eventSerieJson);
	t.is(result.category, 'SEMINAR');
	t.is(typeof result.time_label, 'string');
	t.is(result.comments, '002m1 Proseminar 3, Gruppe 2');
});

test('Should convert event to JSON', async (t) => {
	const result = await makeEventFromJson(eventJson);
	t.is(result.event_serie_id, '50833941');
	t.is(result.period, 20171);
	t.truthy(result.id);
	t.true(
		result.start_date instanceof Date && isFinite(Number(result.start_date))
	);
	t.true(result.end_date instanceof Date && isFinite(Number(result.end_date)));
});

test('Correct year parser', (t) => {
	t.is(periodToString(humanToPeriod('FS16')), 'FS16');
	t.is(periodToString(humanToPeriod('HS16')), 'HS16');
	t.is(periodToString(humanToPeriod('FS14')), 'FS14');
});

test('Correct time parser', (t) => {
	t.is(parseUzhDate('/Date(1487548800000)/'), 1487548800000);
	t.throws(() => parseUzhDate('/Date1487548800000/'));

	t.is(parseUzhTime('PT10H00M00S'), ms('10h'), 'Parses hours to miliseconds');
	t.is(
		parseUzhTime('PT10H10M00S'),
		ms('10h') + ms('10m'),
		'Parses hours to miliseconds'
	);
	t.is(parseUzhTime('PT00H00M20S'), 20000, 'Parses seconds to miliseconds');
	t.throws(() => parseUzhTime('KT10H00M00S'));

	// Wintertime: should subtract one hour afterwards
	t.is(
		makeDate('/Date(1487548800000)/', 'PT10H10M00S').getTime(),
		1487548800000 + ms('10h') + ms('10m') - ms('1h')
	);

	// Summertime: should subtract two hours afterwards
	t.is(
		makeDate('/Date(1490558800000)/', 'PT10H10M00S').getTime(),
		1490558800000 + ms('10h') + ms('10m') - ms('2h')
	);
});

test('Should parse booking period correctly', (t) => {
	const string = 'from Tu 16.01.2018 10:00 to Fr 16.03.2018 24:00';
	const string2 = 'not bookable';
	t.deepEqual(getBookingPeriod(string), [
		new Date('2018/01/16 10:00 (CET)').getTime(),
		new Date('2018/03/16 24:00 (CET)').getTime(),
	]);
	t.deepEqual(getBookingPeriod(string2), null);
	const more = `
		from Th 11.01.2018 10:00 to So 18.03.2018 24:00
		from Th 11.01.2018 10:00 to So 25.03.2018 24:00
		from Sa 10.02.2018 09:00 to Sa 24.03.2018 24:00
		from Th 18.01.2018 10:00 to Tu 30.01.2018 23:59
		from Th 18.01.2018 10:00 to We 16.05.2018 23:59
		from Th 11.01.2018 10:00 to So 11.03.2018 24:00
		from Th 18.01.2018 10:00 to We 25.04.2018 23:59
		from Th 18.01.2018 10:00 to Th 12.04.2018 23:59
		from Th 11.01.2018 10:00 to Mo 05.03.2018 24:00
		from Th 11.01.2018 10:00 to Tu 31.07.2018 24:00
		from So 01.04.2018 10:00 to Mo 07.05.2018 24:00
		from Th 11.01.2018 10:00 to Mo 12.02.2018 24:00
		from Th 11.01.2018 10:00 to So 08.04.2018 24:00
		from Th 11.01.2018 10:00 to So 01.04.2018 24:00
		from Th 15.03.2018 10:00 to So 15.04.2018 24:00
		`;
	t.true(
		more
			.split('\n')
			.map((a) => a.trim())
			.filter(truthy)
			.map((period) => {
				const p = getBookingPeriod(period);
				return p;
			})
			.every((p) => p?.length === 2)
	);
});
