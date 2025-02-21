import got from 'got';
import beforeApiTest from '../helpers/_before-api';
import {afterEach} from '../helpers/_hooks';
import {test} from '../helpers/_test-with-context';

test.beforeEach(beforeApiTest);
test.afterEach(afterEach);

test('Valid person ID should yield person', async (t) => {
	const {statusCode} = await got(
		`${t.context.api}/institution/uzh/person/12345678`
	);
	t.is(statusCode, 200);
});

test('Invalid person ID should give 404 error', async (t) => {
	try {
		await got(`${t.context.api}/institution/uzh/person/00000000`);
	} catch (err) {
		t.is(err.statusCode, 404);
	}
});
