import createHttpError from 'http-errors';
import {AppLanguage} from '../../../../core/models/app-language';
import {userCollection} from '../../db/collections';
import {asyncHandler} from '../../handlers';

export const getPreferences = asyncHandler<
	{},
	{
		language: AppLanguage | null;
	}
>(async (req) => {
	const token = req.get('x-bestande-token');
	const user = await userCollection().findOne({
		token,
	});
	if (!user) {
		throw createHttpError(401, 'Unauthenticated');
	}

	return {
		language: user.preferredLanguage ?? null,
	};
});
