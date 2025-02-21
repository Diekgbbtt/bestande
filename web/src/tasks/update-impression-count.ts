import {ObjectId} from 'mongodb';
import {PromotionResponse} from '../../../core/models/promotion';
import {Job} from '../../../core/types/types';
import {promotionsCollection} from '../db/collections';
import {connectToMongo} from '../db/modern';
import {getDbPromotionStats} from '../db/promotions';

const updateImpressionCount = async (
	job: Job<{
		promotion_id: string;
	}>
) => {
	await connectToMongo();
	const {promotion_id} = job.attrs.data;
	// eslint-disable-next-line @typescript-eslint/await-thenable
	const promotion = ((await promotionsCollection().findOne({
		// @ts-expect-error
		_id: new ObjectId(promotion_id),
	})) as unknown) as PromotionResponse;
	const [view, click, cta] = await getDbPromotionStats(
		promotion._id?.toString() as string
	);
	await promotionsCollection().updateOne(
		{
			_id: promotion._id,
		},
		{
			$set: {
				statistics: {
					view,
					click,
					cta,
				},
			},
		}
	);
	return promotion;
};

export default updateImpressionCount;
