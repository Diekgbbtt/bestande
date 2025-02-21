import test from 'ava';
import {parseCourseCode} from '../../core/functions/parse-course-code';
import {UZH} from '../../core/models/university';

test('Should parse GEO series', (t) => {
	const title = 'GEO 877 Spatial Algorithms';
	const parsed = parseCourseCode(title, UZH);
	t.deepEqual(parsed, {
		series: 'GEO',
		identifier: '877',
		display: true,
		sortable_identfier: '0000000877',
	});
});

test('Should parse MAT series', (t) => {
	const title = 'MAT 001 Cryptography';
	const parsed = parseCourseCode(title, UZH);
	t.deepEqual(parsed, {
		series: 'MAT',
		identifier: '001',
		display: true,
		sortable_identfier: '0000000001',
	});
});

test('Should parse BWL series I', (t) => {
	const title =
		'Betriebswirtschaftslehre I (V + Ü) (Business Administration I)';
	const parsed = parseCourseCode(title, UZH);
	t.deepEqual(parsed, {
		series: 'Betriebswirtschaftslehre',
		identifier: 'I',
		display: false,
		sortable_identfier: '0000000001',
	});
});

test('Should parse BWL series II ', (t) => {
	const title =
		'Betriebswirtschaftslehre II (V + Ü) (Business Administration II)';
	const parsed = parseCourseCode(title, UZH);
	t.deepEqual(parsed, {
		series: 'Betriebswirtschaftslehre',
		identifier: 'II',
		display: false,
		sortable_identfier: '0000000002',
	});
});

test('Should parse Public series I ', (t) => {
	const title = 'Public Law I';
	const parsed = parseCourseCode(title, UZH);
	t.deepEqual(parsed, {
		series: 'Public Law',
		identifier: 'I',
		display: false,
		sortable_identfier: '0000000001',
	});
});

test('Should parse Public Law series II', (t) => {
	const title = 'Public Law II';
	const parsed = parseCourseCode(title, UZH);
	t.deepEqual(parsed, {
		series: 'Public Law',
		identifier: 'II',
		display: false,
		sortable_identfier: '0000000002',
	});
});
