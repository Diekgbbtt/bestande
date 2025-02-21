import {Router} from 'express';
import {
	CREATE_UPDATE_ETH_TASKS,
	CREATE_USER_COUNT_TASK,
} from '../../../../core/models/task-type';
import {asyncHandler} from '../../handlers';
import {insertTaskNative} from '../../queue';
import {mustBeAdmin} from '../middleware';
import createUserCountTask from './user-count-task';

const router = Router();

// @ts-expect-error
router.use(mustBeAdmin);

router.post(
	'/:taskname',
	asyncHandler<
		{
			params: {
				taskname: string;
			};
		},
		void
	>(async (request) => {
		if (request.params.taskname === CREATE_USER_COUNT_TASK) {
			await createUserCountTask(CREATE_USER_COUNT_TASK);
		} else if (request.params.taskname === CREATE_UPDATE_ETH_TASKS) {
			await insertTaskNative(request.params.taskname, {}, 900000);
		} else {
			await insertTaskNative(request.params.taskname, {});
		}
	})
);

export default router;
