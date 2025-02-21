import {Router} from 'express';
import createError from 'http-errors';
import flatten from 'lodash/flatten';
import groupBy from 'lodash/groupBy';
import {ObjectId, WithId} from 'mongodb';
import Slackbot from 'slackbot';
import {v4 as uuid} from 'uuid';
import {Institution} from '../../../../core/models/credit';
import {ApiResponse} from '../../../../core/reducers/api';
import {RatingBaseCore} from '../../../../core/types/ratings';
import {
	moduleCollection,
	ratingsCollection,
	userCollection,
} from '../../db/collections';
import {asyncHandler} from '../../handlers';
import Rating from '../../models/rating';
import {CreateRatingDto} from '../dto/ratings.dto';
import {getHashedEmailFromRequest} from '../../firebase-backend';
import {mustBeAdmin} from '../middleware';
import idRouter from './idRouter';
import {getStudent} from '../../db/students';

const slackbot = process.env.SLACK_TOKEN
	? new Slackbot('hackercompany', process.env.SLACK_TOKEN)
	: null;

const router = Router();

export type RatingWithModule = Rating & {
	module: ApiResponse;
};

// @ts-expect-error
router.get('/', mustBeAdmin);
router.get(
	'/',
	asyncHandler<
		{
			query: {
				offset: string;
			};
		},
		{
			ratings: RatingWithModule[];
		}
	>(async (request) => {
		const ratings: Rating[] = await ratingsCollection()
			.find({
				$or: [{review: {$ne: null}}, {censored: true}],
			})
			.sort({date: -1})
			.skip(request.query.offset ? parseInt(request.query.offset, 10) : 0)
			.limit(30)
			.toArray();
		const grouped = groupBy(ratings, (r) => r.university);
		const modules = await Promise.all(
			Object.keys(grouped).map((university: Institution) => {
				return moduleCollection()
					.find({
						uni_identifier: {
							$in: grouped[university].map((a) => a.uni_identifier),
						},
						university,
					})
					.toArray();
			})
		);
		const modulesFlattened = flatten(modules);
		return {
			ratings: ratings.map((r) => {
				return {
					...r,
					module: modulesFlattened.find(
						(m) =>
							r.university === m.university &&
							r.uni_identifier === m.uni_identifier
					) as ApiResponse,
				};
			}),
		};
	})
);

// @ts-expect-error
router.post('/:id/censor', mustBeAdmin);
router.post(
	'/:id/censor',
	asyncHandler<
		{
			params: {
				id: string;
			};
		},
		void
	>(async (request) => {
		await ratingsCollection().updateOne(
			{
				// @ts-expect-error
				_id: new ObjectId(request.params.id),
			},
			{
				$set: {
					censored: true,
					review: null,
				},
			}
		);
	})
);

router.post(
	'/:id/report',
	asyncHandler<
		{
			params: {
				id: string;
			};
			body: {
				reason: string;
				token: string;
			};
		},
		void
	>(async (request) => {
		const r = ((await ratingsCollection().findOne({
			// @ts-expect-error
			_id: new ObjectId(request.params.id),
		})) as unknown) as Rating;
		const user = await userCollection().findOne({
			token: request.body.token,
		});

		if (!r) {
			throw createError(404, 'Review not found');
		}

		const course = await moduleCollection().findOne({
			uni_identifier: r.uni_identifier,
			university: r.university,
		});

		slackbot.send(
			'#bestande-reports',
			[
				`Report by user ${user?.username ?? '[anonymous]'}`,
				'ratingID ' + r._id,
				'reason ' + request.body.reason,
				'rating text \n > ' + r.review,
				'course ' + (course?.uni_identifier as string),
				'course name ' + (course?.short_name as string),
			].join('\n')
		);
	})
);

router.get(
	'/mine',
	asyncHandler<{}, Rating[]>(async (request) => {
		const hashedEmail = await getHashedEmailFromRequest(request);

		const ratings = await ratingsCollection()
			.find({
				email: hashedEmail,
			})
			.toArray();

		return ratings;
	})
);

router.post(
	'/',
	asyncHandler<
		{
			body: CreateRatingDto;
		},
		void
	>(async (request) => {
		const hashedEmail = await getHashedEmailFromRequest(request);

		const student = await getStudent(hashedEmail);
		if (!student) throw createError(404, 'Student not found');

		const existingRating = await ratingsCollection().findOne({
			email: hashedEmail,
			uni_identifier: request.body.uni_identifier,
			university: request.body.university,
		});
		if (existingRating)
			throw createError(
				409,
				'You already submitted a rating for this course.'
			);

		const {score, review, uni_identifier, university} = request.body;
		const newRatingBase: RatingBaseCore = {
			score: score,
			review: review,
			uni_identifier: uni_identifier,
			university: university,
			username: student.username,
			email: hashedEmail,
			grade: null,
			direction: null,
		};
		const newRating = new Rating(newRatingBase);

		const withIdRating: WithId<Rating> = {...newRating, _id: uuid()};
		withIdRating.date = Date.now();
		const insertedRating = await ratingsCollection().insertOne(withIdRating);
	})
);

router.use(
	'/:id',
	(request, response, next) => {
		response.locals.reviewId = request.params.id;
		next();
	},
	idRouter
);

export default router;

