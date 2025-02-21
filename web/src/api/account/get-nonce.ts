import createHttpError from 'http-errors';
import {NonceResponse} from '../../../../core/types/course-sync';
import {userCollection} from '../../db/collections';
import {asyncHandler} from '../../handlers';

export const getNonce = asyncHandler<{}, NonceResponse>(async (req) => {
	const token = req.get('x-bestande-token');
	const user = await userCollection().findOne({
		token,
	});
	if (!user) {
		throw createHttpError(401, 'unauthenticated');
	}

	return {
		nonce: user.moduleCollectionNonce ?? 0,
	};
});
