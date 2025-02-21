import {NextFunction, Response} from 'express';
import createError from 'http-errors';
import {ExpressRequest} from '../handlers';
import {isUserAdmin} from '../helpers/is-user-admin';

export const mustBeAdmin = (
	request: ExpressRequest,
	response: Response,
	next: NextFunction
) => {
	if (!request.user) {
		throw createError(401, 'Not logged in');
	}

	if (!isUserAdmin(request.user)) {
		throw createError(403, 'Not an admin');
	}

	next();
};
