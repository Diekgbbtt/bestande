import getPort from 'get-port';
import got from 'got';
import createServer from '../src/server';
import {beforeEach} from './helpers/_hooks';
import {test} from './helpers/_test-with-context';

test.beforeEach(async (t) => {
	await beforeEach(t);
	t.context.port = await getPort();
});

test('Server does start', async (t) => {
	createServer().listen(t.context.port);
	const {statusCode} = await got(`http://localhost:${t.context.port}`);
	t.is(statusCode, 200);
});

test('404 gets thrown on unknown API endpoint', async (t) => {
	createServer().listen(t.context.port);
	try {
		await got(`http://localhost:${t.context.port}/api/404`);
		t.fail('should have failed');
	} catch (err) {
		t.is(err.statusCode, 404);
	}
});

test('400 gets thrown on invalid university', async (t) => {
	createServer().listen(t.context.port);
	await got(`http://localhost:${t.context.port}/api/institution/uzh`);
	try {
		await got(`http://localhost:${t.context.port}/api/institution/epfl`);
		t.fail('should have failed');
	} catch (err) {
		t.is(err.statusCode, 400);
	}
});
