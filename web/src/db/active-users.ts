import ms from 'ms';
import xns from 'xns';
import {impressionsCollection} from './collections';
import {connectToMongo} from './modern';

export const getActiveUsers = xns(
	async (range: number = ms('1d')): Promise<number> => {
		await connectToMongo();
		const result = await impressionsCollection()
			.aggregate([
				{$match: {date: {$gt: Date.now() - range}}},
				{$group: {_id: '$identifier'}},
				{$group: {_id: 1, count: {$sum: 1}}},
			])
			.toArray();
		// @ts-expect-error
		return result[0].count as number;
	}
);
