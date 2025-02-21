import createError from 'http-errors';
import {Institution} from '../../../core/models/credit';
import {isValidMd5} from '../core/helpers/is-valid-md5';
import {saveModuleCollectionAnonymous} from '../db/save-module-collection-anonymous';

export const moduleTracking = ({
	university,
	uni_identifier,
	period,
	identifier,
	loggedOut,
}: {
	university: Institution;
	uni_identifier: string;
	period: string;
	identifier: string;
	loggedOut: boolean;
}) => {
	if (!isValidMd5(identifier)) {
		throw createError(400, 'Invalid md5');
	}

	if (period && identifier && uni_identifier) {
		return saveModuleCollectionAnonymous({
			university,
			uni_identifier,
			period,
			identifier,
			loggedOut,
		});
	}

	throw createError(400, 'Invalid data to save user statistics');
};
