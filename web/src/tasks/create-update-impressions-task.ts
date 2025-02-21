import {COUNT_PROMOTION_IMPRESSION} from '../../../core/models/task-type';
import {promotionsCollection} from '../db/collections';
import {connectToMongo} from '../db/modern';
import {insertTaskNative} from '../queue';

const start = async () => {
	await connectToMongo();
	const cursor = promotionsCollection().find({});
	const count = await cursor.count();

	for (let i = 0; i < count; i++) {
		const promo = await cursor.next();
		if (!promo) {
			continue;
		}

		const {_id} = promo;

		await insertTaskNative(COUNT_PROMOTION_IMPRESSION, {
			promotion_id: _id?.toString(),
		});
	}
};

export default start;
