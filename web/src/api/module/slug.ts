import {Router} from 'express';
import Module from '../../../../core/models/module';
import {moduleAddSlug} from '../../db/modules';
import {asyncHandler} from '../../handlers';

const router = Router();

router.get(
	'/',
	asyncHandler<{}, string[]>(async (request, response) => {
		const {module}: {module: Module} = await response.locals;
		return module.slug;
	})
);

router.put(
	'/',
	asyncHandler<
		{
			body: {
				slug: string;
			};
		},
		string[]
	>(async (request, response) => {
		const {slug} = await moduleAddSlug(
			response.locals.module,
			request.body.slug
		);
		return slug;
	})
);

export default router;
