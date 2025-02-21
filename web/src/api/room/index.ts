import {Router} from 'express';
import createError from 'http-errors';
import Room from '../../../../core/models/room';
import {roomCollection} from '../../db/collections';
import {asyncHandler, asyncNextHandler} from '../../handlers';

const router = Router();

router.use(
	'/:id',
	asyncNextHandler<{
		params: {
			id: string;
		};
	}>(async (request, response, next) => {
		const {institution} = response.locals;
		const room = await roomCollection().findOne({
			university: institution,
			id: request.params.id,
		});
		if (!room) {
			throw createError(404, 'Room not found');
		}

		response.locals.room = new Room(room);
		next();
	})
);

router.get(
	'/:id',
	asyncHandler((request, response) => {
		const {room} = response.locals;
		return room;
	})
);

export default router;
