import got from 'got';
import beforeApiTest from '../helpers/_before-api';
import {afterEach} from '../helpers/_hooks';
import {test} from '../helpers/_test-with-context';

test.beforeEach(beforeApiTest);
test.afterEach.always(afterEach);

test('No valid module search query should throw 400', async (t) => {
	try {
		await got(`${t.context.api}/institution/uzh/module`);
		t.fail();
	} catch (err) {
		t.is(err.statusCode, 400);
	}
});

test('Valid module should yield module', async (t) => {
	const {statusCode} = await got(
		`${t.context.api}/institution/uzh/module/50430354`
	);
	t.is(statusCode, 200);
});

test('Invalid module should throw 404', async (t) => {
	try {
		await got(`${t.context.api}/institution/uzh/module/9999999`);
		t.fail();
	} catch (err) {
		t.is(err.statusCode, 404);
	}
});
