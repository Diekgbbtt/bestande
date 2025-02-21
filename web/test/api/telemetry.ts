import got from 'got';
import md5 from 'md5';
import updateModuleStats from '../../src/tasks/update-user-count';
import beforeApiTest from '../helpers/_before-api';
import {afterEach} from '../helpers/_hooks';
import {test} from '../helpers/_test-with-context';

test.beforeEach(beforeApiTest);
test.afterEach.always(afterEach);

const updateCount = (uni_identifier: string) => {
	return updateModuleStats({
		type: 'COUNT_USERS',
		attrs: {data: {uni_identifier, university: 'UZH'}},
	});
};

test('Should allow to track anonymously', async (t) => {
	await got.post(
		`${t.context.api}/institution/uzh/telemetry?identifier=${md5('joburg')}`,
		{
			json: true,
			headers: {
				'content-type': 'application/json',
			},
			body: {
				data: [
					{
						uni_identifier: '50430354',
						period: 'HS15',
					},
				],
			},
		}
	);
	await updateCount('50430354');
	const response = await got(
		`${t.context.api}/institution/uzh/module/50430354`,
		{json: true}
	);
	t.is(response.body.data.userCount.all, 1);

	await got.post(
		`${t.context.api}/institution/uzh/telemetry?identifier=${md5('joburg')}`,
		{
			json: true,
			headers: {
				'content-type': 'application/json',
			},
			body: {
				data: [
					{
						uni_identifier: '50430354',
						period: 'HS15',
					},
				],
			},
		}
	);
	await updateCount('50430354');
	const response2 = await got(
		`${t.context.api}/institution/uzh/module/50430354`,
		{json: true}
	);
	t.is(response2.body.data.userCount.all, 1, 'Should not count twice');

	await got.post(
		`${t.context.api}/institution/uzh/telemetry?identifier=${md5('jabond')}`,
		{
			json: true,
			headers: {
				'content-type': 'application/json',
			},
			body: {
				data: [
					{
						uni_identifier: '50430354',
						period: 'HS15',
					},
				],
			},
		}
	);
	await updateCount('50430354');
	const response3 = await got(
		`${t.context.api}/institution/uzh/module/50430354`,
		{json: true}
	);
	t.is(response3.body.data.userCount.all, 2);
});

test('Should reject to track when providing invalid MD5', async (t) => {
	try {
		await got.post(
			`${t.context.api}/institution/uzh/telemetry?identifier=abc`,
			{
				headers: {
					'content-type': 'application/json',
				},
				json: true,
				body: {
					data: [
						{
							uni_identifier: 50430354,
							period: 'HS15',
						},
					],
				},
			}
		);
		t.fail();
	} catch (err) {
		t.regex(err.message, /400/);
	}
});
test('Should not count twice', async (t) => {
	await got.post(
		`${t.context.api}/institution/uzh/telemetry?identifier=${md5('joburg')}`,
		{
			json: true,
			headers: {
				'content-type': 'application/json',
			},
			body: {
				data: [
					{
						uni_identifier: '50430354',
						period: 'HS15',
					},
					{
						uni_identifier: '50430354',
						period: 'HS15',
					},
				],
			},
		}
	);
	await updateCount('50430354');
	const response = await got(
		`${t.context.api}/institution/uzh/module/50430354`,
		{json: true}
	);
	t.is(response.body.data.userCount.all, 1);
});

test('Should be able to add multiple modules', async (t) => {
	await got.post(
		`${t.context.api}/institution/uzh/telemetry?identifier=${md5('joburg')}`,
		{
			json: true,
			headers: {
				'content-type': 'application/json',
			},
			body: {
				data: [
					{
						uni_identifier: '50430354',
						period: 'HS15',
					},
					{
						uni_identifier: '50430355',
						period: 'HS15',
					},
				],
			},
		}
	);
	await Promise.all([updateCount('50430354'), updateCount('50430355')]);
	const response1 = await got(
		`${t.context.api}/institution/uzh/module/50430354`,
		{json: true}
	);
	const response2 = await got(
		`${t.context.api}/institution/uzh/module/50430354`,
		{json: true}
	);
	t.is(response1.body.data.userCount.all, 1);
	t.is(response2.body.data.userCount.all, 1);
});
