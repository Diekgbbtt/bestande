import {
	fetchListPage,
	fetchModule,
	fetchPerson,
} from '../../src/tasks/fetch-eth';
import {test} from '../helpers/_test-with-context';

test('Should not be able to fetch module that does not exist', async (t) => {
	await t.throwsAsync(() => fetchModule('113376', '2018S', false));
});

test('Should be able to fetch module that exists', async (t) => {
	await fetchModule('113376', '2017S', false);
	t.pass();
});

test('Should not be able to fetch person that does not exist', async (t) => {
	await t.throwsAsync(() => fetchPerson('12027743', '2017S', false));
});

test('Should be able to fetch person that exists', async (t) => {
	await fetchPerson('10027743', '2017S', true);
	t.pass();
});

test('Should be able to fetch single ETH listing page', async (t) => {
	const result = await fetchListPage('2017W', 100);
	t.true(result[0] > 300);
	t.true(result[0] < 310);
});
