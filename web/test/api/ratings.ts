import got from 'got';
import md5 from 'md5';
import {UZH} from '../../../core/models/university';
import {ensureRatingsIndices} from '../../src/db/indices';
import updateModuleStats from '../../src/tasks/update-user-count';
import beforeApiTest from '../helpers/_before-api';
import {afterEach} from '../helpers/_hooks';
import {test} from '../helpers/_test-with-context';

test.beforeEach(beforeApiTest);
test.afterEach(afterEach);

const addRating = async (t) => {
	return got.put(`${t.context.api}/ratings`, {
		json: true,
		body: {
			score: 3,
			review: 'Ich liebe dieses Fach!',
			name: 'Maximilian Muster',
			direction: 'BSc in Informatik 2008',
			grade: 4.75,
			uni_identifier: '50430354',
			university: UZH,
			token: md5('joburg'),
		},
	});
};

const addVote = async (t, _id, vote = 'up') => {
	return got.post(`${t.context.api}/ratings/${_id}/vote`, {
		json: true,
		body: {
			vote,
			token: md5('lupell'),
		},
	});
};

const updateRating = async (t, _id) => {
	return got.post(`${t.context.api}/ratings/${_id}`, {
		json: true,
		body: {
			score: 4,
			review: 'Dieses Fach ist lit!',
			name: 'Maximilian Muster',
			direction: null,
			grade: 5,
			token: md5('joburg'),
		},
	});
};

const getMine = async (t, username = 'joburg') => {
	return got.post(`${t.context.api}/ratings/mine`, {
		json: true,
		body: {
			token: md5(username),
		},
	});
};

const getRatings = async (t) => {
	return got(`${t.context.api}/institution/uzh/module/50430354/ratings`, {
		json: true,
	});
};

test('Should be able to add a review', async (t) => {
	await ensureRatingsIndices();
	const response = await addRating(t);
	t.true(response.body.success);
	const ratingsResponse = await getRatings(t);
	t.is(ratingsResponse.body.data.total, 1);
	t.deepEqual(ratingsResponse.body.data.overview, {
		1: 0,
		2: 0,
		3: 1,
		4: 0,
		5: 0,
	});
});

test('Should be able to update a review', async (t) => {
	await ensureRatingsIndices();
	const response = await addRating(t);
	const {_id} = response.body.data.rating;
	await updateRating(t, _id);
	t.true(response.body.success);
	const ratingsResponse = await getRatings(t);
	t.is(ratingsResponse.body.data.total, 1);
	const [rating] = ratingsResponse.body.data.ratings;
	t.is(rating.grade, 5);
	t.is(rating.review, 'Dieses Fach ist lit!');
	t.is(rating.direction, null);
});

test('Should be able to get my review IDs', async (t) => {
	await ensureRatingsIndices();
	const response = await addRating(t);
	const {_id} = response.body.data.rating;
	const {body} = await getMine(t);
	t.deepEqual(body.data.ratings, [
		{
			_id,
			university: UZH,
			uni_identifier: response.body.data.rating.uni_identifier,
		},
	]);
});

test('Should make correct module summary', async (t) => {
	await ensureRatingsIndices();
	await addRating(t);
	await updateModuleStats({
		type: 'COUNT_USERS',
		attrs: {data: {uni_identifier: '50430354', university: 'UZH'}},
	});
	const response = await got(
		`${t.context.api}/institution/uzh/module/50430354`,
		{json: true}
	);
	t.deepEqual(response.body.data.ratingSummary, {
		total: 1,
		average: 3,
	});
});

test('Should be able to downvote, then upvote', async (t) => {
	await ensureRatingsIndices();
	const {body} = await addRating(t);
	await addVote(t, body.data.rating._id, 'down');
	await addVote(t, body.data.rating._id);
	const ratings = await getRatings(t);
	t.is(ratings.body.data.ratings[0].ups, 1);
	t.is(ratings.body.data.ratings[0].downs, 0);
	t.falsy(ratings.body.data.ratings[0].upvotes);
	t.falsy(ratings.body.data.ratings[0].downvotes);

	const votesResponse = await getMine(t, 'lupell');
	t.deepEqual(votesResponse.body.data.votes, [
		{_id: body.data.rating._id, vote: 'up'},
	]);
});
