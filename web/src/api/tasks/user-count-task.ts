import {
	nextPeriod,
	previousPeriod,
} from '../../../../core/functions/validate-period';
import {
	currentPeriod,
	recommendationPeriod,
} from '../../../../core/models/current-period';
import {CREATE_USER_COUNT_TASK} from '../../../../core/models/task-type';
import {moduleCollection} from '../../db/collections';
import {connectToMongo} from '../../db/modern';
import {insertTaskNative} from '../../queue';

export const query = {
	'semesters.period': {
		$in: [
			currentPeriod,
			recommendationPeriod,
			previousPeriod(currentPeriod),
			previousPeriod(previousPeriod(currentPeriod)),
			nextPeriod(currentPeriod),
		].filter(Boolean),
	},
};

const createUserCountTask = async (task: string = CREATE_USER_COUNT_TASK) => {
	await connectToMongo();
	const count = await moduleCollection().countDocuments(query);
	const batches = Math.ceil(count / 100);
	for (let i = 0; i < batches; i++) {
		await insertTaskNative(task, {
			offset: i * 100,
		});
	}
};

export default createUserCountTask;
