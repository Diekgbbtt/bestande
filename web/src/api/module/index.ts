import {Router} from 'express';
import createError from 'http-errors';
import flattenDeep from 'lodash/flattenDeep';
import Module from '../../../../core/models/module';
import {RawRelatedModule} from '../../../../core/models/raw-related-module';
import {expandModule} from '../../actions/expand-module';
import {moduleCollection} from '../../db/collections';
import {getByGuess} from '../../db/modules';
import {asyncHandler, asyncNextHandler} from '../../handlers';
import {minimumFields} from '../../helpers/module-preview-minimum-fields';
import {suggestAlgolia} from '../../search';
import {moduleDocumentsRouter} from './documents';
import examreturnsRouter from './examreturns';
import ratingsRouter from './ratings';
import semesterRouter from './semester';
import slugRouter from './slug';

const router = Router();

router.get(
	'/',
	asyncHandler<
		{
			query: {
				q: string;
				offset?: number;
			};
		},
		{
			results: any[];
			total: number;
		}
	>(async (request, response) => {
		if (!request.query.q) {
			throw createError(400, 'Need to specify query');
		}

		const {hits, nbHits} = await suggestAlgolia({
			institution: response.locals.institution,
			query: request.query.q,
			offset: Number(request.query.offset) || 0,
		});
		return {
			results: hits,
			total: nbHits,
		};
	})
);

router.use(
	'/:id',
	asyncNextHandler<{
		params: {
			id: string;
		};
	}>(async (request, response, next) => {
		const module = await getByGuess(
			response.locals.institution,
			request.params.id
		);
		if (!module) {
			throw createError(404, 'Module not found');
		}

		response.locals.module = module;
		next();
	})
);

router.get(
	'/:id',
	asyncHandler<{}, Module>(async (request, response) => {
		const {module}: {module: Module} = response.locals;
		return expandModule(module);
	})
);

router.use('/:id/slug', slugRouter);
router.use('/:id/semester', semesterRouter);
router.use('/:id/ratings', ratingsRouter);
router.use('/:id/documents', moduleDocumentsRouter);
router.use('/:id/examreturns', examreturnsRouter);

router.get(
	'/:id/related',
	asyncHandler(async (request, response) => {
		const course = response.locals.module;
		if (!course.related || !course.related.previous) {
			return null;
		}

		const topModules = flattenDeep(
			Object.keys(course.related).map((k) => course.related?.[k])
		) as RawRelatedModule[];
		const items: RawRelatedModule[] = [];
		for (const item of topModules) {
			const index = items.findIndex((i) => i.module === item.module);
			if (index > -1) {
				items[index].count += item.count;
			} else {
				items.push({...item});
			}
		}

		const modules = await moduleCollection()
			.find(
				{
					uni_identifier: {
						$in: items.map((i) => i.module),
					},
					university: course.university,
				},
				{projection: minimumFields}
			)
			.toArray();
		return items.map((item) => ({
			module: modules.find((m) => m.uni_identifier === item.module),
			count: item.count,
		}));
	})
);

export default router;
