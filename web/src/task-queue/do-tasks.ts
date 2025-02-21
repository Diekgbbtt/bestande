import chalk from 'chalk';
import {
	COUNT_PROMOTION_IMPRESSION,
	COUNT_USERS,
	CREATE_TIMETABLE_TASKS,
	CREATE_UPDATE_DEPARTMENTS_ETH_TASKS,
	CREATE_UPDATE_ETH_TASKS,
	CREATE_UPDATE_PROMOTION_IMPRESSIONS_TASKS,
	CREATE_UPDATE_ROOMS_TASK,
	CREATE_UPDATE_UZH_TASKS,
	CREATE_USER_COUNT_TASK,
	UPDATE_DEPARTMENTS_ETH,
	UPDATE_MODULE_ETH,
	UPDATE_MODULE_UZH,
	UPDATE_ROOM_ETH,
	UPDATE_ROOM_UZH,
	UPDATE_TIMETABLE,
} from '../../../core/models/task-type';
import {taskCollection} from '../db/collections';
import {connectToMongo} from '../db/modern';
import {createUserCountTask} from '../tasks/create-module-tasks';
import createRoomUzhTasks from '../tasks/create-room-uzh-tasks';
import createUpdateEthDepartmentTasks from '../tasks/create-update-eth-department-tasks';
import {createUpdateEthTasks} from '../tasks/create-update-eth-tasks';
import createUpdateImpressionsTask from '../tasks/create-update-impressions-task';
import {createUpdateUzhTasks} from '../tasks/create-update-uzh-tasks';
import {start as timetableTask} from '../tasks/timetable-tasks';
import updateEthDepartment from '../tasks/update-eth-departments';
import updateEthModule from '../tasks/update-eth-module';
import updateEthRoom from '../tasks/update-eth-room';
import updateImpressionCount from '../tasks/update-impression-count';
import updateModuleStats from '../tasks/update-user-count';
import updateUzhEvent from '../tasks/update-uzh-event';
import updateUzhModule from '../tasks/update-uzh-module';
import updateUzhRoom from '../tasks/update-uzh-room';

const doTask = async (task) => {
	switch (task.type) {
		case UPDATE_MODULE_UZH:
			return updateUzhModule(task);
		case UPDATE_MODULE_ETH:
			return updateEthModule(task);
		case UPDATE_TIMETABLE:
			return updateUzhEvent(task);
		case UPDATE_DEPARTMENTS_ETH:
			return updateEthDepartment(task);
		case COUNT_USERS:
			return updateModuleStats(task);
		case CREATE_USER_COUNT_TASK:
			return createUserCountTask(task);
		case CREATE_UPDATE_ROOMS_TASK:
			return createRoomUzhTasks();
		case CREATE_UPDATE_DEPARTMENTS_ETH_TASKS:
			return createUpdateEthDepartmentTasks();
		case UPDATE_ROOM_UZH:
			return updateUzhRoom(task);
		case UPDATE_ROOM_ETH:
			return updateEthRoom(task);
		case CREATE_TIMETABLE_TASKS:
			return timetableTask();
		case CREATE_UPDATE_PROMOTION_IMPRESSIONS_TASKS:
			return createUpdateImpressionsTask();
		case COUNT_PROMOTION_IMPRESSION:
			return updateImpressionCount(task);
		case CREATE_UPDATE_UZH_TASKS:
			return createUpdateUzhTasks();
		case CREATE_UPDATE_ETH_TASKS:
			return createUpdateEthTasks();
		default:
			throw new Error(`Type ${task.type} not found for task ${task._id}`);
	}
};

const doTaskWithTimeout = (task, timeout = 900000) => {
	return new Promise<void>((resolve, reject) => {
		let resolved = false;
		setTimeout(
			() => {
				if (!resolved) {
					reject(new Error('Time out'));
				}
			},
			task.timeout ? task.timeout : timeout
		);

		doTask(task)
			.then(() => {
				resolved = true;
				resolve();
			})
			.catch((err) => reject(err));
	});
};

export const doMultipleTasks = async (limit = 4) => {
	await connectToMongo();
	const tasks = await taskCollection()
		.find({error: {$exists: false}})
		.limit(limit)
		.toArray();
	if (tasks.length === 0) {
		console.log('Done with all tasks');
		await new Promise((resolve) => {
			setTimeout(resolve, 10000);
		});
		return;
	}

	const errored: {_id: string; err: Error}[] = [];
	await Promise.all(
		tasks.map(async (task) => {
			try {
				await doTaskWithTimeout(task);
				// @ts-expect-error
				await taskCollection().deleteOne({_id: task._id});
				console.log(`Finished task ${task.type}`);
			} catch (err) {
				errored.push({
					// @ts-expect-error
					_id: task._id as string,
					err,
				});
				console.log(chalk.red(err));
				// @ts-expect-error
				task.error = `${err.message} ${err.stack}`;
				await taskCollection().updateOne(
					{
						// @ts-expect-error
						_id: task._id,
					},
					{
						$set: task,
					},
					{
						upsert: true,
					}
				);
				// @ts-expect-error
				console.log(`Error with ${task._id}`, err);
			}
		})
	);
	const newCount = await taskCollection().countDocuments({
		error: {$exists: false},
	});
	console.log(chalk.gray(`${newCount} tasks remaining.`));
	await doMultipleTasks(limit);
};
