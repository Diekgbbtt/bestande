import got from 'got';
import {UZH} from '../../../core/models/university';
import {moduleCollection} from '../../src/db/collections';
import beforeApiTest from '../helpers/_before-api';
import {afterEach} from '../helpers/_hooks';
import {test} from '../helpers/_test-with-context';

test.beforeEach(beforeApiTest);
test.afterEach.always(afterEach);

const addSlug = (api, id, slug) => {
	return got(`${api}/institution/uzh/module/${id}/slug`, {
		method: 'PUT',
		json: true,
		body: {
			slug,
		},
	});
};

test.serial('Should allow to add slug', async (t) => {
	await got(`${t.context.api}/institution/uzh/module/50430354/slug`, {
		method: 'PUT',
		json: true,
		body: {
			slug: 'game-theory',
		},
	});
	const response = await got(
		`${t.context.api}/institution/uzh/module/50430354/slug`,
		{
			json: true,
		}
	);
	t.is(response.body.data.length, 1);
});

test('Assigning already occupied slug should throw error', async (t) => {
	// @ts-expect-error
	await moduleCollection().insertOne({
		university: UZH,
		uni_identifier: '12345678',
		name: 'Auditing',
		short_name: 'Auditing',
	});

	await addSlug(t.context.api, '50430354', 'game-theory');
	try {
		await addSlug(t.context.api, '12345678', 'game-theory');
		t.fail();
	} catch (err) {
		t.regex(err.message, /Conflict/);
	}
});

test('Should resolve slug', async (t) => {
	await addSlug(t.context.api, '50430354', 'game-theory');
	const {statusCode} = await got(
		`${t.context.api}/institution/uzh/module/game-theory`
	);
	t.is(statusCode, 200);
});

test('Invalid slug should not be added', async (t) => {
	await t.throwsAsync(() => addSlug(t.context.api, '50430354', 'game@theory'));
});

test('Uppercase slug should resolve', async (t) => {
	await addSlug(t.context.api, '50430354', 'game-theory');
	const {statusCode} = await got(
		`${t.context.api}/institution/uzh/module/GAME-THEORY`
	);
	t.is(statusCode, 200);
});
