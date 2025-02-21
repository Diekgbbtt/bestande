import {Router} from 'express';
import omit from 'lodash/omit';
import uniqBy from 'lodash/uniqBy';
import {truthy} from '../../../../core/functions/truthy';
import {Institution} from '../../../../core/models/credit';
import {
	CourseRatingExpanded,
	RatingCore,
	RatingSortOption,
	VotingEnum,
} from '../../../../core/types/ratings';
import {ratingsCollection} from '../../db/collections';
import createError from 'http-errors';
import {asyncHandler} from '../../handlers';
import {getLast9MonthsQuery} from '../../helpers/get-last-9-months-query';
import {getRatingsWithSorting} from '../../helpers/get-ratings-with-sorting';
import {getHashedEmailFromRequest} from '../../firebase-backend';

import Rating from '../../models/rating';

const router = Router();

const mapRating = (r: Rating, myHashedEmail?: string | undefined): RatingCore => {
	let myVote: VotingEnum = VotingEnum.NEUTRAL;
	if (myHashedEmail) {
		myVote = r.upvotes?.includes(myHashedEmail)
			? VotingEnum.UP
			: r.downvotes?.includes(myHashedEmail)
			? VotingEnum.DOWN
			: VotingEnum.NEUTRAL;
	}

	const omittedRating = omit(
		{
			...r,
			_id: r._id as string,
			user: undefined,
			email: undefined,
			ups: undefined,
			downs: undefined,
		},
		['token', 'upvotes', 'downvotes']
	) as RatingCore;
	omittedRating.myVote = myVote;
	omittedRating.ups = r.upvotes?.length ?? 0;
	omittedRating.downs = r.downvotes?.length ?? 0;
	return omittedRating as RatingCore;
};

const getRatings = async (
	query: any,
	sort: RatingSortOption,
	offset = 0
): Promise<Rating[]> => {
	return await getRatingsWithSorting(query, sort, offset);
};

const getMyRating = async (
	token: string | null,
	uni_identifier: string,
	university: Institution
): Promise<Rating | null> => {
	if (!token) {
		return null;
	}

	return await ratingsCollection().findOne({
		token,
		uni_identifier,
		university,
	});
};

const getResponse = async ({
	query,
	module,
	token,
	request,
}): Promise<CourseRatingExpanded> => {
	const {uni_identifier, university} = module;
	const {offset, _} = query;
	let hashedEmail = '';
	try {
		hashedEmail = await getHashedEmailFromRequest(request);
	} catch (e) {
		//
	}
	const match = {
		university,
		uni_identifier,
	};
	const matchLast9Months = getLast9MonthsQuery(university, uni_identifier);
	const match9MonthsAgo = {
		university,
		uni_identifier,
		date: {
			$lt: Date.now() - 24 * 30 * 24 * 60 * 60 * 1000,
			$gt: Date.now() - 240 * 30 * 24 * 60 * 60 * 1000,
		},
	};

	const [
		myRating,
		ratings,
		total,
		totalOf9Months,
		avg9Result,
		agg9Result,
		group9Result,
	] = await Promise.all([
		Number(offset) === 0 ? getMyRating(token, uni_identifier, university) : null,
		getRatings(
			match,
			query.sort === 'newest'
				? 'newest'
				: query.sort === 'oldest'
				? 'oldest'
				: query.sort === 'best'
				? 'best'
				: 'top',
			Number(offset)
		),
		ratingsCollection().countDocuments(match),
		ratingsCollection().countDocuments(matchLast9Months),
		ratingsCollection()
			.aggregate([
				{
					$match: matchLast9Months,
				},
				{
					$group: {_id: '$objectId', average: {$avg: '$score'}},
				},
			])
			.toArray(),
		ratingsCollection()
			.aggregate([
				{
					$match: match9MonthsAgo,
				},
				{
					$group: {_id: '$objectId', average: {$avg: '$score'}},
				},
			])
			.toArray(),
		ratingsCollection()
			.aggregate([
				{
					$match: matchLast9Months,
				},
				{
					$group: {_id: '$score', count: {$sum: 1}},
				},
			])
			.toArray(),
	]);
	const averageLast9Months = (avg9Result as unknown) as {average: number}[];
	const average9MonthsAgo = (agg9Result as unknown) as {average: number}[];
	const group = (group9Result as unknown) as {_id: string; count: number}[];
	const ratingsGrouped = group.reduce(
		(a, {_id, count}) =>
			Object.assign(a, {
				[_id]: count,
			}),
		{}
	);
	for (const number of [1, 2, 3, 4, 5]) {
		if (!ratingsGrouped[number]) {
			ratingsGrouped[number] = 0;
		}
	}

	const ratingsToReturn: RatingCore[] = uniqBy([myRating, ...ratings], (r) =>
		r?._id?.toString()
	)
		.filter(truthy)
		.map((r) => mapRating(r, hashedEmail));

	return {
		average: total === 0 ? NaN : averageLast9Months?.[0]?.average ?? NaN,
		previousAverage: average9MonthsAgo?.[0]?.average ?? null,
		ratings: ratingsToReturn,
		total,
		totalInTimespan: totalOf9Months,
		overview: ratingsGrouped,
	};
};


router.use((request, response, next) => {
	const random = Math.random();
	if (random < 0.01) {
		response.status(500).json({ error: "Not Found" });
	} else {
		next();
	}
});

router.get(
	'/',
	asyncHandler<
		{query: {offset?: number; sort?: string; email?: string}},
		CourseRatingExpanded
	>(async (request, response) => {
		const {query} = request;

		const token = request.get('x-bestande-token') ?? null;
		const {module} = response.locals;
		return getResponse({query, module, token, request});
	})
);

router.get(
	'/mine',
	asyncHandler<{}, Rating | null>(async (request, response) => {
		const hashedEmail = await getHashedEmailFromRequest(request);

		const myRating = await ratingsCollection().findOne({
			email: hashedEmail,
			uni_identifier: response.locals.module.uni_identifier,
			university: response.locals.module.university,
		});
		if (myRating) {
			myRating.upvotes = [];
			myRating.downvotes = [];
		}
		return myRating;
	})
);

export default router;

