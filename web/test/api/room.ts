import got from 'got';
import beforeApiTest from '../helpers/_before-api';
import {afterEach} from '../helpers/_hooks';
import {test} from '../helpers/_test-with-context';

test.beforeEach(beforeApiTest);
test.afterEach(afterEach);

test('Valid room ID should yield room', async (t) => {
	const {statusCode} = await got(
		`${t.context.api}/institution/uzh/room/50331324`
	);
	t.is(statusCode, 200);
});

test('Invalid room ID should give 404 error', async (t) => {
	try {
		await got(`${t.context.api}/institution/uzh/room/000000`);
	} catch (err) {
		t.is(err.statusCode, 404);
	}
});
