import createHttpError from 'http-errors';
import isMd5 from 'is-md5';
import {humanToPeriod} from '../../../core/functions/uzh-period';
import {ModuleCollectionItem} from '../../../core/models/credit';
import {moduleCollectionCollection} from './collections';

export const saveModuleCollectionAnonymous = async ({
	university,
	uni_identifier,
	period,
	identifier,
	loggedOut,
}): Promise<ModuleCollectionItem> => {
	if (!isMd5(identifier)) {
		throw createHttpError(400, 'Must provide anonymous identifier');
	}

	const obj: ModuleCollectionItem = {
		uni_identifier,
		university,
		period: humanToPeriod(period) as number,
		user: identifier,
		created: Date.now(),
		type: 'anonymous' as const,
		loggedOut,
	};
	const existing = await moduleCollectionCollection().findOne({
		uni_identifier: obj.uni_identifier,
		university: obj.university,
		user: identifier,
	});
	if (existing) {
		return existing;
	}

	await moduleCollectionCollection().insertOne(obj);
	return obj;
};
