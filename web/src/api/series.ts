import {Router} from 'express';
import {ModulePreview} from '../../../core/models/module';
import {CourseSeriesResponse} from '../../../core/types/types';
import {moduleCollection} from '../db/collections';
import {asyncHandler} from '../handlers';
import {minimumFields} from '../helpers/module-preview-minimum-fields';

import createHttpError = require('http-errors');

export const seriesRouter = Router();

const perPage = 50;

seriesRouter.get(
	'/:code',
	asyncHandler<
		{
			params: {
				code: string;
			};
			query: {page: string};
		},
		CourseSeriesResponse
	>(async (request, response) => {
		const {code} = request.params;
		let page = 0;
		if (typeof code !== 'string') {
			throw createHttpError(400, 'code must be string');
		}

		if (request.query.page) {
			if (isNaN(Number(request.query.page))) {
				throw createHttpError(400, 'page must be a number');
			}

			page = Number(request.query.page);
		}

		const cursor = moduleCollection().find(
			{
				'courseCode.series': code,
				university: response.locals.institution,
			},
			{projection: minimumFields}
		);
		const total = await cursor.count();

		const modules = ((await cursor
			.limit(perPage)
			.skip(page * perPage)
			.sort({'courseCode.sortable_identfier': 1})
			.toArray()) as unknown) as ModulePreview[];
		return {modules, total};
	})
);
