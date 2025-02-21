import {Router} from 'express';
import createError from 'http-errors';
/*
import uzhFaculty from '../../tasks/uzh-faculty';
import {UZHFaculty} from '../../core/models/uzh-faculties';
import {ImageType} from '../../../../app/common/types/image';
*/
import uniq from 'lodash/uniq';
import {ObjectID, WithId} from 'mongodb';
import {immutableReverse} from '../../../../core/functions/immutable-reverse';
import {truthy} from '../../../../core/functions/truthy';
import {PromotionResponse} from '../../../../core/models/promotion';
import {promotionsCollection} from '../../db/collections';
import {
	getDbInstitutions,
	getDbPromotionLanguages,
	getDbPromotionPlatforms,
	getDbPromotionStats,
} from '../../db/promotions';
import {asyncHandler} from '../../handlers';

const router = Router();

export type AnalyticsResponse = {
	impressions: number[];
	platforms: any;
	languages: any;
	institutions: any;
	targetingFactor: number;
	series: string[];
	abSeries: string[];
	promotion: Pick<
		PromotionResponse,
		| 'image'
		| 'promoter_link'
		| 'promoter'
		| 'type'
		| 'faculty'
		| 'open_in_browser'
		| 'price'
		| 'name'
		| '_id'
		| 'retired'
	>;
};

const getParentPromotion = async (
	promotion: PromotionResponse
): Promise<PromotionResponse> => {
	if (promotion.child_of) {
		// eslint-disable-next-line @typescript-eslint/await-thenable
		const parent = ((await promotionsCollection().findOne({
			// @ts-expect-error
			_id: new ObjectID(promotion.child_of),
		})) as unknown) as PromotionResponse;
		return getParentPromotion(parent);
	}

	if (promotion.alternative_of) {
		// eslint-disable-next-line @typescript-eslint/await-thenable
		const parent = ((await promotionsCollection().findOne({
			// @ts-expect-error
			_id: new ObjectID(promotion.alternative_of),
		})) as unknown) as PromotionResponse;
		return getParentPromotion(parent);
	}

	return promotion;
};

const getAllCardIds = async (id: string, child_of?: string) => {
	const children = await promotionsCollection()
		.find(
			{
				child_of: id,
			},
			{projection: {_id: 1}}
		)
		.toArray();
	const siblingsAndSelf = child_of
		? await promotionsCollection()
			.find(
				{
					child_of,
				},
				{projection: {_id: 1}}
			)
			.toArray()
		: [];
	const parent = child_of
		? // eslint-disable-next-line @typescript-eslint/await-thenable
		  await promotionsCollection().findOne({
			// @ts-expect-error
			_id: ObjectID.createFromHexString(child_of),
		  })
		: null;
	const series = immutableReverse(
		uniq<string>(
			immutableReverse(
				[
					parent
						? (parent as WithId<PromotionResponse>)._id.toHexString()
						: null,
					id,
					...children.map((c) => c._id?.toString()),
					...siblingsAndSelf.map((c) => c._id?.toString()),
				].filter(truthy)
			)
		)
	);
	return series;
};

router.get(
	'/:id',
	asyncHandler<
		{
			query: {
				password: string;
			};
			params: {
				id: string;
			};
		},
		AnalyticsResponse
	>(async (request) => {
		if (!ObjectID.isValid(request.params.id)) {
			throw createError(400, 'Invalid ID format');
		}

		// eslint-disable-next-line @typescript-eslint/await-thenable
		const promotion = ((await promotionsCollection().findOne({
			// @ts-expect-error
			_id: new ObjectID(request.params.id),
		})) as unknown) as PromotionResponse;
		if (!promotion) {
			throw createError(404, 'Promotion not found');
		}

		const parent = await getParentPromotion(promotion);
		if (parent.password !== request.query.password) {
			throw createError(403, 'Invalid password');
		}

		const [
			impressions,
			platforms,
			languages,
			institutions,
		] = await Promise.all([
			getDbPromotionStats(request.params.id),
			getDbPromotionPlatforms(request.params.id),
			getDbPromotionLanguages(request.params.id),
			getDbInstitutions(request.params.id),
		]);
		const targetingFactor = 1;
		const series = await getAllCardIds(request.params.id, promotion.child_of);

		const abChildren = await promotionsCollection()
			.find(
				{
					alternative_of: parent._id?.toString(),
				},
				{projection: {_id: 1}}
			)
			.toArray();

		const abSeries = immutableReverse(
			uniq(
				immutableReverse(
					[
						parent ? parent._id?.toString() : null,
						...abChildren.map((c) => c._id?.toString()),
					].filter(truthy)
				)
			)
		);

		const indexOfParent = promotion.child_of
			? abSeries.indexOf(promotion.child_of)
			: -1;
		if (indexOfParent > -1 && promotion._id) {
			abSeries[indexOfParent] = promotion._id?.toString();
		}

		const {
			image,
			promoter_link,
			promoter,
			type,
			faculty,
			open_in_browser,
			price,
			name,
			_id,
			retired,
		} = promotion;
		return {
			impressions,
			platforms,
			languages,
			targetingFactor,
			series,
			abSeries,
			institutions,
			promotion: {
				image,
				promoter_link,
				promoter,
				type,
				faculty,
				open_in_browser,
				price,
				name,
				// @ts-expect-error
				_id: _id.toHexString(),
				retired,
			},
		};
	})
);

export default router;
