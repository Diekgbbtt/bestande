import Router from 'express';
import createError from 'http-errors';
import omit from 'lodash/omit';
import Slackbot from 'slackbot';
import {moduleCollection, ratingsCollection} from '../../db/collections';
import {asyncHandler, asyncNextHandler} from '../../handlers';
import Rating from '../../models/rating';
import {getHashedEmailFromRequest} from '../../firebase-backend';
import {PostVoteDto} from './dtos';

import {
	addVoteToDownvotes,
	addVoteToUpvotes,
	removeVoteFromDownvotes,
	removeVoteFromUpvotes,
} from '../../db/rating-voting-operations';
import {VotingEnum} from '../../../../core/types/ratings';

const router = Router();

const slackbot = process.env.SLACK_TOKEN
	? new Slackbot('hackercompany', process.env.SLACK_TOKEN)
	: null;

router.use(
	asyncNextHandler(async (request, response, next) => {
		// if (!ObjectID.isValid(response.locals.reviewId)) {
		// 	throw createError(400, 'Invalid review ID format');
		// }

		// response.locals.rating = new Rating(
		// 	// @ts-expect-error
		// 	// eslint-disable-next-line @typescript-eslint/await-thenable
		// 	await ratingsCollection().findOne({
		// 		// @ts-expect-error
		// 		_id: new ObjectID(response.locals.reviewId),
		// 	})
		// );
		// if (!response.locals.rating) {
		// 	throw createError(404, 'Review not found');
		// }

		next();
	})
);

router.post(
	'/vote',
	asyncHandler<
		{
			body: PostVoteDto;
		},
		void
	>(async (request, response) => {
		console.log('Updating rating: ', response.locals.reviewId);
		const hashedEmail = await getHashedEmailFromRequest(request);

		const vote = request.body.vote;
		const ratingId = response.locals.reviewId;

		const currentRating = await ratingsCollection().findOne({_id: ratingId});
		if (!currentRating) throw createError(404, 'Rating not found');
		const hasUpvoted = currentRating.upvotes?.includes(hashedEmail);
		const hasDownvoted = currentRating.downvotes?.includes(hashedEmail);

		if (vote === VotingEnum.UP) {
			if (hasUpvoted) {
				await removeVoteFromUpvotes(ratingId, hashedEmail);
			} else {
				await addVoteToUpvotes(ratingId, hashedEmail);
			}
		} else if (vote === VotingEnum.DOWN) {
			if (hasDownvoted) {
				await removeVoteFromDownvotes(ratingId, hashedEmail);
			} else {
				await addVoteToDownvotes(ratingId, hashedEmail);
			}
		}
	})
);

router.post(
	'/',
	asyncHandler<
		{
			body: {
				score: number;
				review: string;
				name: string;
				grade: string;
				direction: string;
				token: string;
			};
		},
		any
	>(async (request, response) => {
		const {score, review, name, grade, direction, token} = request.body;
		const {rating} = response.locals;
		if (token !== rating.token) {
			throw createError(400, 'Invalid token');
		}

		const course = await moduleCollection().findOne({
			uni_identifier: (rating as Rating).uni_identifier,
			university: (rating as Rating).university,
		});

		if (!course) {
			throw createError(404, 'Course not found');
		}

		const newReview = {
			...rating,
			score,
			review,
			name,
			grade,
			direction,
			date: Date.now(),
		};
		await ratingsCollection().updateOne(
			{
				_id: rating._id,
			},
			{
				$set: newReview,
			},
			{
				upsert: true,
			}
		);
		if (review && slackbot) {
			slackbot.send(
				'#bestande-reviews',
				[
					`${
						rating.review && rating.review !== review
							? 'Geänderte'
							: 'Neue'
					} Rezension für ${course.short_name}`,
					`> ${review}`,
					'https://bestande.ch/admin/ratings',
				].join('\n')
			);
		}

		return {
			rating: omit(newReview, ['token', 'upvotes', 'downvotes']),
		};
	})
);

router.put(
	'/',
	asyncHandler<
		{
			body: {
				score: number;
				review: string;
			};
		},
		void
	>(async (request, response) => {
		const {score, review} = request.body;

		const hashedEmail = await getHashedEmailFromRequest(request);

		if (![0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].includes(score)) {
			throw createError(400, 'Invalid score');
		}

		if (typeof review !== 'string' && review) {
			throw createError(400, 'Invalid review');
		}

		if (review === 'text') {
			throw createError(400, 'This review string is not allowed');
		}

		const existingRating = await ratingsCollection().findOne({
			email: hashedEmail,
			_id: response.locals.reviewId,
		});

		if (!existingRating) {
			throw createError(
				400,
				'The review you are trying to update does not exist'
			);
		}

		await ratingsCollection().updateOne(
			{
				_id: existingRating._id,
			},
			{
				$set: {
					review: review,
					score: score,
				},
			}
		);
	})
);

router.delete(
	'/',
	asyncHandler<{}, {}>(async (request, response) => {
		const hashedEmail = await getHashedEmailFromRequest(request);

		const rating = await ratingsCollection().findOne({
			_id: response.locals.reviewId,
			email: hashedEmail,
		});

		if (!rating) throw createError(404, 'Review not found');

		await ratingsCollection().deleteOne({
			_id: response.locals.reviewId,
		});
		return {};
	})
);

export default router;

