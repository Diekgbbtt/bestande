import xns from 'xns';
import {PromotionResponse} from '../core/models/promotion';
import {promotionsCollection} from '../web/src/db/collections';
import {connectToMongo} from '../web/src/db/modern';
import updateImpressionCount from '../web/src/tasks/update-impression-count';

xns(async () => {
	await connectToMongo();

	const cursor = promotionsCollection().find();
	const count = await cursor.count();

	let i = 0;

	while (await cursor.hasNext()) {
		const {_id, name} = ((await cursor.next()) as unknown) as PromotionResponse;
		await updateImpressionCount({
			attrs: {
				data: {
					promotion_id: _id as string,
				},
			},
		});
		i++;
		console.log(`☝️  ${i}/${count} Updated promotion ${name}`);
	}

	console.log('All done! 👌');
});
