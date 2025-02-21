import {Router} from 'express';
import createError from 'http-errors';
import ms from 'ms';
import {truthy} from '../../../../core/functions/truthy';
import {Institution} from '../../../../core/models/credit';
import {getActiveUsers} from '../../db/active-users';
import {
	messagesCollection,
	moduleCollectionCollection,
	ratingsCollection,
} from '../../db/collections';
import {asyncHandler, asyncNextHandler} from '../../handlers';
import {isUserAdmin} from '../../helpers/is-user-admin';

const router = Router();

router.use(
	// eslint-disable-next-line @typescript-eslint/require-await
	asyncNextHandler(async (request, response, next) => {
		if (!request.user) {
			throw createError(401, 'Not logged in');
		}

		if (!isUserAdmin(request.user)) {
			throw createError(403, 'Not an admin');
		}

		next();
	})
);

router.get(
	'/count/:institution/',
	asyncHandler<
		{
			params: {
				institution: Institution;
			};
		},
		number
	>(async (request) => {
		const [result] = await moduleCollectionCollection()
			.aggregate(
				[
					{
						$match: {
							university: request.params.institution.toUpperCase(),
						},
					},
					{$group: {_id: '$user'}},
					{$group: {_id: 1, count: {$sum: 1}}},
				].filter(truthy)
			)
			.toArray();
		// @ts-expect-error
		return result?.count || 0;
	})
);

router.get(
	'/dau',
	asyncHandler<{}, number>(async () => {
		return getActiveUsers(ms('1d'));
	})
);

router.get(
	'/chatmessages',
	asyncHandler<{}, number>(async () => {
		return messagesCollection().countDocuments({});
	})
);

router.get(
	'/mau',
	asyncHandler<{}, number>(async () => {
		return getActiveUsers(ms('30d'));
	})
);

router.get(
	'/ratings',
	asyncHandler<{}, number>(async () => {
		return ratingsCollection().countDocuments({});
	})
);

router.get(
	'/reviews',
	asyncHandler<{}, number>(async () => {
		return ratingsCollection().countDocuments({review: {$ne: null}});
	})
);

export default router;
