import {PASS_FAIL} from '../../../core/models/grading';
import {
	fetchEvents,
	fetchList,
	fetchModule,
	fetchRoom,
} from '../../src/tasks/fetch-uzh';
import {parseGrading} from '../../src/tasks/grading';
import {test} from '../helpers/_test-with-context';

test('Should make sucessful request', async (t) => {
	const module = await fetchModule(50491823, 2018, '003', 'en');
	t.is(
		module.SmText,
		'Einführung in die Wirtschaftsprüfung (VU) (Introduction to Auditing)'
	);
});

test('Should receive events', async (t) => {
	const response = await fetchEvents('50892582', 2018, '003');
	t.is(response.Schedule.results.length, 14);
});

test('Should fetch list of modules', async (t) => {
	const json = await fetchList(10);
	t.is(json.results.length, 10);
});

test('Should fetch room', async (t) => {
	const json = await fetchRoom('49000453', 2020, '003');
	t.is(json.CityPlz, '8006 Zürich');
});

test('Grading should be mapped correctly', async (t) => {
	const module = await fetchModule(50324033, 2018, '003', 'en');
	t.is(parseGrading(module), PASS_FAIL);
});
