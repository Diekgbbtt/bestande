import {Router} from 'express';
import {moduleGetUrl} from '../../../core/models/module';
import {moduleCollection} from '../db/collections';
import {asyncHandler} from '../handlers';

const router = Router();

router.get(
	'/',
	asyncHandler<
		{
			query: {
				query: string;
			};
		},
		{url: string | false}
	>(async (request) => {
		const {query} = request.query;
		const mod = await moduleCollection().findOne({
			slug: query,
		});
		if (mod) {
			return {
				url: moduleGetUrl(mod),
			};
		}

		return {
			url: false,
		};
	})
);

export default router;
