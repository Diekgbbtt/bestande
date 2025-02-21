import parseRoomName from '../../src/helpers/parse-room';
import {test} from '../helpers/_test-with-context';

test('Should correctly parse text in parentheses', (t) => {
	const parsed = parseRoomName('BIN-1.D.29 (Seminarraum)');
	t.is(parsed.name, 'BIN-1.D.29');
	t.is(parsed.subtitle, 'Seminarraum');
});

test('Filter out Konferenzraum', (t) => {
	const parsed = parseRoomName('RAA-E-29 Seminarraum');
	t.is(parsed.name, 'RAA-E-29');
	t.is(parsed.subtitle, 'Seminarraum');
});

test('Shoulf add campus', (t) => {
	const parsed = parseRoomName('BIN-0-K.11/12/13');
	t.is(parsed.campus, 'Oerlikon');

	const parsed2 = parseRoomName('SOE-F-12');
	t.is(parsed2.campus, 'Zentrum');

	const parsed3 = parseRoomName('Y42-K-80 (Seminarraum)');
	t.is(parsed3.name, 'Y42-K-80');
	t.is(parsed3.subtitle, 'Seminarraum');
	t.is(parsed3.campus, 'Irchel');
});

test('Replace with space', (t) => {
	const parsed = parseRoomName('Y11-G-34 Praktikumsraum mit Computer');
	t.is(parsed.name, 'Y11-G-34');
	t.is(parsed.subtitle, 'Praktikumsraum mit Computer');
});

test('Kantonsschule example', (t) => {
	const parsed = parseRoomName('06xx Kantonsschule Freudenberg Z 27');
	t.is(parsed.name, 'Z 27');
	t.is(parsed.campus, 'Kantonsschule Freudenberg');
});
