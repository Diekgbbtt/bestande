import {Institution} from '../../../core/models/credit';
import {UserCount} from '../../../core/models/module';
import {moduleCollectionCollection} from '../db/collections';

export const calculateUserCount = async (
	university: Institution,
	uni_identifier: string
): Promise<UserCount> => {
	const all = await moduleCollectionCollection().countDocuments({
		uni_identifier,
		university,
	});
	const bySemester = ((await moduleCollectionCollection()
		.aggregate([
			{
				$match: {
					uni_identifier,
					university,
				},
			},
			{
				$unwind: '$period',
			},
			{
				$group: {_id: '$period', users: {$addToSet: '$_id'}},
			},
			{
				$project: {
					period: 1,
					count: {$size: '$users'},
				},
			},
		])
		.toArray()) as unknown) as {_id: number; count: number}[];
	const mapped = bySemester.map((s) => {
		return {
			period: s._id,
			count: s.count,
		};
	});
	return {
		all,
		semester: mapped,
	};
};
