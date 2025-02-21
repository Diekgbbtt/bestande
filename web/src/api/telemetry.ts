import {Router} from 'express';
import createError from 'http-errors';
import pickBy from 'lodash/pickBy';
import sampleSize from 'lodash/sampleSize';
import uniqBy from 'lodash/uniqBy';
import {AppLanguage} from '../../../core/models/app-language';
import {ModuleCollectionItem} from '../../../core/models/credit';
import {Impression, ImpressionType} from '../../../core/models/impression-type';
import {ImpressionPlatform} from '../../../core/models/platform';
import {UZH} from '../../../core/models/university';
import {impressionsCollection} from '../db/collections';
import {asyncHandler} from '../handlers';
import {moduleTracking} from '../helpers/module-tracking';

const router = Router();

const isValid = (data_point: {uni_identifier: string; period: number}) => {
	const {uni_identifier, period} = data_point;
	// TODO: Check if period is valid
	return uni_identifier && period;
};

router.post(
	'/',
	asyncHandler<
		{
			body: {
				data: any;
				loggedOut: false;
			};
			query: {
				identifier: string;
			};
		},
		void
	>(async (request, response) => {
		const {data, loggedOut = false} = request.body;
		const {identifier} = request.query;
		if (Array.isArray(data) && data.every(isValid)) {
			// Deduplicate data to avoid race condition
			const deduplicated = uniqBy(data, (d) => d.uni_identifier + d.period);
			const sample =
				response.locals.institution === UZH
					? sampleSize(deduplicated, 5)
					: deduplicated;
			await Promise.all<ModuleCollectionItem>(
				sample.map((d) => {
					const {uni_identifier, period} = d;
					return moduleTracking({
						university: response.locals.institution,
						uni_identifier,
						period,
						identifier,
						loggedOut,
					});
				})
			);
		} else {
			throw createError(400, 'Invalid request');
		}
	})
);

router.get(
	'/impression',
	asyncHandler(async () => {
		const impressions = await impressionsCollection().countDocuments({});
		return {
			impressions,
		};
	})
);

router.post(
	'/impression',
	asyncHandler<
		{
			body: {
				identifier: string;
				content: ImpressionType;
				content_id: string;
				level: string;
				platform: ImpressionPlatform;
				language: AppLanguage;
				direction: string;
				version: string;
			};
		},
		void
	>(async (request, response) => {
		const {
			identifier,
			content,
			content_id,
			level,
			platform,
			language,
			direction,
			version,
		} = request.body;
		const {institution} = response.locals;
		const impression: Impression = {
			institution,
			platform,
			content,
			language,
			identifier,
			...pickBy({
				content_id,
				level,
				direction,
				version,
			}),
			date: Date.now(),
		};
		await impressionsCollection().insertOne(impression);
	})
);

export default router;
