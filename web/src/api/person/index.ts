import {Router} from 'express';
import createError from 'http-errors';
import {ExpandedPerson} from '../../../../core/types/people-state';
import {peopleCollection} from '../../db/collections';
import {asyncHandler, asyncNextHandler} from '../../handlers';
import {expandPerson} from '../../models/server-person';

const router = Router();

router.use(
	'/:id',
	asyncNextHandler<{
		params: {
			id: string;
		};
	}>(async (request, response, next) => {
		const {institution} = response.locals;
		const person = await peopleCollection().findOne({
			uni_identifier: request.params.id,
			university: institution,
		});
		if (!person) {
			throw createError(404, 'Person not found');
		}

		response.locals.person = expandPerson(person);
		next();
	})
);

router.get(
	'/:id',
	asyncHandler<{}, ExpandedPerson>(async (request, response) => {
		const {person}: {person: ExpandedPerson} = await response.locals;
		return person;
	})
);

export default router;
