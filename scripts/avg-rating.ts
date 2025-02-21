import xns from 'xns';
import {ratingsCollection} from '../web/src/db/collections';
import {connectToMongo} from '../web/src/db/modern';

xns(async () => {
	await connectToMongo();
	const query = {
		date: {
			$gt: new Date('2019-01-01').getTime(),
			$lt: new Date('2019-12-31').getTime(),
		},
	};
	const count = await ratingsCollection().countDocuments(query);
	const avg = await ratingsCollection()
		.aggregate([
			{
				$match: query,
			},
			{
				$group: {
					_id: null,
					avgScore: {$avg: '$score'},
				},
			},
		])
		.toArray();

	return [avg, count];
});
