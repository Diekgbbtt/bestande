import xns from 'xns';
import {
	documentsCollection,
	impressionsCollection,
} from '../web/src/db/collections';
import {connectToMongo} from '../web/src/db/modern';

xns(async () => {
	await connectToMongo();
	const fileCursor = documentsCollection().find({});
	let totalDownloads = 0;
	while (await fileCursor.hasNext()) {
		const file = await fileCursor.next();
		const [downloads, views] = await Promise.all([
			impressionsCollection().countDocuments({
				content_id: file?._id.toHexString(),
				content: 'FILE',
				level: 'CTA',
			}),
			impressionsCollection().countDocuments({
				content_id: file?._id.toHexString(),
				content: 'FILE',
				level: 'CLICK',
			}),
		]);
		await documentsCollection().updateOne(
			{
				_id: file?._id,
			},
			{
				$set: {
					stats: {
						downloads,
						views,
					},
				},
			}
		);
		totalDownloads += downloads;
		console.log(`${file?.fileName}: ${views} views, ${downloads} downloads.`);
	}

	console.log(`Total downloads: ${totalDownloads}`);
});
