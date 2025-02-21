import ObjectID from 'bson-objectid';
import {Router} from 'express';
import createError from 'http-errors';
import groupBy from 'lodash/groupBy';
import omit from 'lodash/omit';
import {truthy} from '../../../../core/functions/truthy';
import {PromotionResponse} from '../../../../core/models/promotion';
import {UpdatePromotionResponse} from '../../../../core/types/promotion-state';
import {WebUser} from '../../../../core/types/ratings';
import {promotionsCollection} from '../../db/collections';
import {asyncHandler, asyncNextHandler} from '../../handlers';
import {isUserAdmin} from '../../helpers/is-user-admin';
import {
	filterPromotions,
	makeInitialQuery,
	Profile,
} from '../../helpers/targeting';
import validatePromotion from '../../helpers/validate-promotion';
import {mustBeAdmin} from '../middleware';
import analyticsRouter from './analytics';
import eduwoRouter from './eduwo';

const router = Router();

const makePromotionModel = (
	promotion: PromotionResponse,
	user?: WebUser
): PromotionResponse => {
	return omit(
		promotion,
		['price', isUserAdmin(user) ? null : 'password'].filter(truthy)
	) as PromotionResponse;
};

router.use('/analytics', analyticsRouter);
router.use('/eduwo', eduwoRouter);

// @ts-expect-error
router.get('/', mustBeAdmin);
router.get(
	['/', '/all'],
	asyncHandler(async (request) => {
		const promotions = await promotionsCollection()
			.find({})
			.sort({
				start_date: 1,
			})
			.toArray();
		return {
			promotions: promotions.map((p) => makePromotionModel(p, request.user)),
		};
	})
);

router.get(
	'/availabilities',
	asyncHandler(async () => {
		const promotions: PromotionResponse[] = await promotionsCollection()
			.find({
				scheduled: true,
			})
			.toArray();
		const schedules = promotions.map((p) => [
			p.scheduled_start,
			p.scheduled_end,
		]);
		return {
			schedules,
		};
	})
);

const replaceWithAlternatives = (
	promotions: PromotionResponse[],
	alternatives: {[key: string]: PromotionResponse[]}
) => {
	const promosWithAlternative = Object.keys(alternatives);
	for (const id of promosWithAlternative) {
		const choices = [
			promotions.find((p) => p._id?.toString() === id),
			...alternatives[id],
		];
		const random = Math.floor(Math.random() * (alternatives[id].length + 1));
		promotions = [
			...promotions.filter((p) => p._id?.toString() !== id),
			choices[random],
		].filter(truthy);
	}

	return promotions;
};

const getPromotionsWithAbTesting = async (query: any) => {
	const promos = await promotionsCollection()
		.find({
			...query,
			child_of: {$exists: false},
			alternative_of: {$exists: false},
			retired: {$ne: true},
		})
		.sort({
			start_date: 1,
		})
		.toArray();
	const alternatives = await promotionsCollection()
		.find({
			alternative_of: {$in: promos.map((p) => p._id?.toString())},
			retired: {$ne: true},
		})
		.toArray();
	const alternativesForId = groupBy(alternatives, (a) => a.alternative_of);
	const withAbTestingSwapped = replaceWithAlternatives(
		promos,
		alternativesForId
	);
	const children = await promotionsCollection()
		.find({
			child_of: {$in: withAbTestingSwapped.map((p) => p._id?.toString())},
		})
		.toArray();
	return [...withAbTestingSwapped, ...children];
};

router.get(
	'/live',
	asyncHandler(async (request) => {
		const promotions = await getPromotionsWithAbTesting(makeInitialQuery());
		return {
			promotions: promotions.map((p) => makePromotionModel(p, request?.user)),
		};
	})
);

router.post(
	'/live',
	asyncHandler<
		{
			body: Profile;
		},
		{
			promotions: PromotionResponse[];
		}
	>(async (request) => {
		const query = makeInitialQuery(request.body);
		const promotions = await getPromotionsWithAbTesting(query);
		const response = {
			promotions: filterPromotions(promotions, request.body).map((p) =>
				makePromotionModel(p, request.user)
			),
		};
		return response;
	})
);

// @ts-expect-error
router.put('/', mustBeAdmin);
router.put(
	'/',
	asyncHandler<
		{body: {promotion: PromotionResponse}},
		{promotion: PromotionResponse}
	>(async (request) => {
		const {promotion} = request.body;
		if (validatePromotion(promotion).length > 0) {
			throw createError(400, 'Invalid event');
		}

		promotion.creator = request.user?._id as string;
		// @ts-expect-error
		const created = await promotionsCollection().insertOne(promotion);
		// @ts-expect-error
		return {promotion: makePromotionModel(created.ops[0], request.user)};
	})
);

router.use(
	['/:id'],
	asyncNextHandler<{
		params: {
			id: string;
		};
	}>(async (request, response, next) => {
		if (!ObjectID.isValid(request.params.id)) {
			throw createError(400, 'Invalid ID format');
		}

		if (!request.user) {
			throw createError(401, 'Unauthenticated');
		}

		// eslint-disable-next-line @typescript-eslint/await-thenable
		const promotion = ((await promotionsCollection().findOne({
			// @ts-expect-error
			_id: new ObjectID(request.params.id),
		})) as unknown) as PromotionResponse;
		if (!promotion) {
			throw createError(404, 'Promotion not found');
		}

		response.locals.promotion = promotion;
		if (!isUserAdmin(request.user)) {
			throw createError(403, 'Not creator or admin');
		}

		next();
	})
);

router.get(
	'/:id',
	asyncHandler(async (request, response) => {
		const {promotion}: {promotion: PromotionResponse} = await response.locals;
		return {promotion: makePromotionModel(promotion, request.user)};
	})
);

router.post(
	'/:id',
	asyncHandler<
		{
			body: {promotion: PromotionResponse};
		},
		UpdatePromotionResponse
	>(async (request, response) => {
		Object.assign(response.locals.promotion, request.body.promotion);
		if (validatePromotion(response.locals.promotion).length > 0) {
			throw createError(400, 'Invalid event');
		}

		response.locals.promotion._id = new ObjectID(response.locals.promotion._id);
		response.locals.promotion.creator = request.user?._id;
		await promotionsCollection().updateOne(
			{
				_id: response.locals.promotion._id,
			},
			{
				$set: response.locals.promotion,
			},
			{
				upsert: true,
			}
		);
		return {promotion: response.locals.promotion};
	})
);

router.delete(
	'/:id',
	asyncHandler(async (request, response) => {
		await promotionsCollection().deleteOne({
			_id: response.locals.promotion._id,
		});
	})
);

export default router;
