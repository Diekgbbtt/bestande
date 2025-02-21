import {Institution} from '../../../core/models/credit';
import {COUNT_USERS} from '../../../core/models/task-type';
import {Job} from '../../../core/types/types';
import {query} from '../api/tasks/user-count-task';
import {moduleCollection} from '../db/collections';
import {connectToMongo} from '../db/modern';
import {insertTaskNative} from '../queue';

const start = async (
	job: Job<{
		offset: number;
	}>,
	fn: (university: Institution, uni_identifier: string) => Promise<void>
) => {
	await connectToMongo();
	const cursor = moduleCollection()
		.find(query)
		.skip(job.attrs.data.offset || 0)
		.limit(100)
		.batchSize(20);

	while (await cursor.hasNext()) {
		const mod = await cursor.next();
		if (!mod) {
			throw new Error('Expected mod');
		}

		const {university, uni_identifier} = mod;
		await fn(university, uni_identifier);
	}
};

export const createUserCountTask = (
	job: Job<{
		offset: number;
	}>
) =>
	// @ts-expect-error
	start(job, (university, uni_identifier) => {
		return insertTaskNative(COUNT_USERS, {
			university,
			uni_identifier,
		});
	});
