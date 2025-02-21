import ms from 'ms';
import {CREATE_UPDATE_ETH_TASKS} from '../../core/models/task-type';
import {Job} from '../../core/types/types';
import {taskCollection} from './db/collections';
import {connectToMongo} from './db/modern';

export const insertTaskNative = async <T>(
	type: string,
	data: T,
	timeout = 900000
) => {
	const task: Job<T> = {
		type,
		attrs: {
			data,
		},
	};
	if (timeout) {
		task.timeout = timeout;
	}

	await connectToMongo();
	return taskCollection().insertOne(task);
};

export const recurringTasks = () => {
	setTimeout(() => {
		setInterval(() => {
			insertTaskNative(CREATE_UPDATE_ETH_TASKS, {})
				.then(() =>
					console.log('Successfully created CREATE_UPDATE_ETH_TASKS tasks')
				)
				.catch((err) =>
					console.log('Error in creating CREATE_UPDATE_ETH_TASKS tasks', err)
				);
		}, ms('1d'));
	}, ms('12h'));
};
