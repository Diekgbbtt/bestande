import {ratingsCollection} from './collections';
import {connectToMongo} from './modern';

export const ensureRatingsIndices = async () => {
	await connectToMongo();
	await ratingsCollection().createIndex(
		{
			uni_identifier: 1,
			university: 1,
		},
		{
			name: 'RatingsIndex',
		}
	);
	await ratingsCollection().createIndex(
		{
			date: -1,
		},
		{
			name: 'ReviewSort',
		}
	);
};
