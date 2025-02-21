import {EXAM} from '../../../core/models/module-type';
import {UZH} from '../../../core/models/university';
import {parseExam} from '../../src/helpers/parse-exam';
import {test} from '../helpers/_test-with-context';

test('Should not work without exact time', (t) => {
	const string =
		'Aktive Mitarbeit, Referat mit Handout, schriftliche Arbeit (empfohlener Abgabetermin 16.2.18). Referatsthemen werden ab dem 21. August 2017 von der Dozentin vergeben.';
	const output = parseExam({
		uni_identifier: '50090001',
		string,
		university: UZH,
		period: 20181,
	});
	t.is(output, null);
});

test('Should only parse english and german for now', (t) => {
	const string =
		'Exposé oral pendant le semestre; examen final échelonné sur le 26 avril, 3 mai, 17 mai, 24 mai et 31 mai 2018.';
	const output = parseExam({
		uni_identifier: '50090001',
		string,
		university: UZH,
		period: 20181,
	});
	t.is(output, null);
});

test('Basic example', (t) => {
	const string =
		'Homework assignments (40%), Final exam (60%); Final exam: 09.03.18, 13:00 - 16:00';
	const response = parseExam({
		uni_identifier: '50090001',
		string,
		university: UZH,
		period: 20181,
	});
	t.deepEqual(
		response?.events[0].start_date,
		new Date('2018/03/09 13:00 UTC+1')
	);
	t.deepEqual(response?.events[0].end_date, new Date('2018/03/09 16:00 UTC+1'));
	t.deepEqual(response?.events[0].id, '1');
	t.deepEqual(response?.events[0].university, UZH);
	t.deepEqual(response?.events[0].event_serie_id, '50090001-exam');
	t.deepEqual(response?.eventSerie.id, '50090001-exam');
	t.deepEqual(response?.eventSerie.time_label, null);
	t.deepEqual(response?.eventSerie.comments, string);
	t.deepEqual(response?.eventSerie.people, []);
	t.deepEqual(response?.eventSerie.category, EXAM);
});

test('Another working example', (t) => {
	const string = 'Date for the exam: Wednesday, 20 June 2018, 10.00 - 12.00 h.';
	const response = parseExam({
		uni_identifier: '50090001',
		string,
		university: UZH,
		period: 20181,
	});
	t.deepEqual(
		response?.events[0].start_date,
		new Date('2018/06/20 10:00 UTC+2')
	);
	t.deepEqual(response?.events[0].end_date, new Date('2018/06/20 12:00 UTC+2'));
});

test('Should work as well', (t) => {
	const string = 'Prüfungstermin: Montag, 18 Juni 2018, 16:00-18:00 Uhr';
	const response = parseExam({
		uni_identifier: '50090001',
		string,
		university: UZH,
		period: 20181,
	});
	t.deepEqual(
		response?.events[0].start_date,
		new Date('2018/06/18 16:00 UTC+2')
	);
	t.deepEqual(response?.events[0].end_date, new Date('2018/06/18 18:00 UTC+2'));
});

test('Written exam on: 15.6.18, 8:00-10.00h', (t) => {
	const string = 'Written exam on: 15.6.18, 8:00-10.00h';
	const response = parseExam({
		uni_identifier: '50090001',
		string,
		university: UZH,
		period: 20181,
	});
	t.deepEqual(
		response?.events[0].start_date,
		new Date('2018/06/15 08:00 UTC+2')
	);
	t.deepEqual(response?.events[0].end_date, new Date('2018/06/15 10:00 UTC+2'));
});

test('Schriftliche Prüfung am Montag, 11. Juni, 2018, 8-10 Uhr.', (t) => {
	const string = 'Schriftliche Prüfung am Montag, 11. Juni, 2018, 8-10 Uhr.';
	const response = parseExam({
		uni_identifier: '50090001',
		string,
		university: UZH,
		period: 20181,
	});
	t.deepEqual(
		response?.events[0].start_date,
		new Date('2018/06/11 08:00 UTC+2')
	);
	t.deepEqual(response?.events[0].end_date, new Date('2018/06/11 10:00 UTC+2'));
});

test('Written exam scheduled for June 19, 2018, 10-12h.', (t) => {
	const string = 'Written exam scheduled for June 19, 2018, 10-12h.';
	const response = parseExam({
		uni_identifier: '50090001',
		string,
		university: UZH,
		period: 20181,
	});
	t.deepEqual(
		response?.events[0].start_date,
		new Date('2018/06/19 10:00 UTC+2')
	);
	t.deepEqual(response?.events[0].end_date, new Date('2018/06/19 12:00 UTC+2'));
});

test('Should parse minutes better', (t) => {
	const string = 'written exam on 15.06.2018, 14:00-15:45h';
	const response = parseExam({
		uni_identifier: '50090001',
		string,
		university: UZH,
		period: 20181,
	});
	t.deepEqual(
		response?.events[0].start_date,
		new Date('2018/06/15 14:00 UTC+2')
	);
	t.deepEqual(response?.events[0].end_date, new Date('2018/06/15 15:45 UTC+2'));
});

test('Should not use wrong timezone', (t) => {
	const string =
		'Homeworks (25%) and written final exam (75%). Exam date: Tue 12.6.18, 14-16 h.';
	const response = parseExam({
		uni_identifier: '50090001',
		string,
		university: UZH,
		period: 20181,
	});
	t.deepEqual(
		response?.events[0].start_date,
		new Date('2018/06/12 14:00 UTC+2')
	);
	t.deepEqual(response?.events[0].end_date, new Date('2018/06/12 16:00 UTC+2'));
});

test('Should not confuse A.M and P.M.', (t) => {
	const string = 'Written exam on Thursday, 15 February 2018, 10-12 a.m.';
	const response = parseExam({
		uni_identifier: '50090001',
		string,
		university: UZH,
		period: 20181,
	});
	t.deepEqual(
		response?.events[0].start_date,
		new Date('2018/02/15 10:00 UTC+1')
	);
	t.deepEqual(response?.events[0].end_date, new Date('2018/02/15 12:00 UTC+1'));
});

test('Should work with multiple dates', (t) => {
	const string = `
	The grade will be based on
		- 25% midterm (11.4.18; 10-12h),
		- 65% final exam (20.6.18; 10-12h),
		- 10% participation grade (based on quizzes and assignments).
	`;
	const response = parseExam({
		uni_identifier: '50090001',
		string,
		university: UZH,
		period: 20181,
	});
	t.deepEqual(
		response?.events[0].start_date,
		new Date('2018/04/11 10:00 UTC+2')
	);
	t.deepEqual(response?.events[0].end_date, new Date('2018/04/11 12:00 UTC+2'));
	t.deepEqual(
		response?.events[1].start_date,
		new Date('2018/06/20 10:00 UTC+2')
	);
	t.deepEqual(response?.events[1].end_date, new Date('2018/06/20 12:00 UTC+2'));
});

test('Web 2.0', (t) => {
	const string =
		'Schriftliche Klausurarbeit findet am 15. Juni 2018 von 14:00 bis 16:00 Uhr statt.';
	const response = parseExam({
		uni_identifier: '123456',
		string,
		university: UZH,
		period: 20181,
	});
	t.deepEqual(
		response?.events[0].start_date,
		new Date('2018/06/15 14:00 UTC+2')
	);
});
