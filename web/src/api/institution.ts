import {Router} from 'express';
import createError from 'http-errors';
import {mapToUniversity} from '../../../core/functions/uni-slug';
import {Institution} from '../../../core/models/credit';
import {asyncHandler, asyncNextHandler} from '../handlers';
import {eventRouter} from './event';
import foodRouter from './food';
import moduleRouter from './module';
import personRouter from './person';
import recommendationsRouter from './recommendations';
import roomRouter from './room';
import {seriesRouter} from './series';
import telemetryRouter from './telemetry';

const router = Router();

router.use(
	'/:institution',
	asyncNextHandler<{
		params: {
			institution: Institution;
		};
	}>(async (request, response, next) => {
		const {institution} = request.params;
		try {
			response.locals.institution = mapToUniversity(institution);
		} catch (err) {
			throw createError(400, `Unknown institution slug "${institution}"`);
		}

		next();
	})
);

router.get(
	'/:institution',
	asyncHandler<
		{},
		{
			institution: Institution;
		}
	>(async (request, response) => {
		const {institution} = await response.locals;
		return {
			institution,
		};
	})
);
router.use('/:institution/module', moduleRouter);
router.use('/:institution/person', personRouter);
router.use('/:institution/room', roomRouter);
router.use('/:institution/telemetry', telemetryRouter);
router.use('/:institution/food', foodRouter);
router.use('/:institution/event', eventRouter);
router.use('/:institution/recommendations', recommendationsRouter);
router.use('/:institution/series', seriesRouter);

export default router;
