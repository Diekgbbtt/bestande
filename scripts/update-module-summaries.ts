import {RatingSummary} from '../core/models/module';
import {moduleCollection, ratingsCollection} from '../web/src/db/collections';
import {connectToMongo} from '../web/src/db/modern';

const updateModuleSummaries = async () => {
	console.log('Updating module summaries...');

	await connectToMongo();
	const cursor = moduleCollection().find();

	const count = await moduleCollection().countDocuments();
	let progress = 0;

	while (await cursor.hasNext()) {
		const module = await cursor.next();
		if (!module) {
			throw new Error('mod does not exist');
		}

		const {uni_identifier, university} = module;

		const allRatingsOfModule = await ratingsCollection()
			.find({uni_identifier: uni_identifier, university: university})
			.toArray();
		const total = allRatingsOfModule.length;
		let average = 0;
		if (total !== 0) {
			average =
				allRatingsOfModule.reduce((acc, curr) => acc + curr.score, 0) /
				total;
		}

		const ratingSummary: RatingSummary = {
			average: average,
			total: total,
		};
		if (
			module.ratingSummary.average !== ratingSummary.average ||
			module.ratingSummary.total !== ratingSummary.total
		) {
			await moduleCollection().updateOne(
				{uni_identifier: uni_identifier, university: university},
				{$set: {ratingSummary: ratingSummary}}
			);
		}
		progress++;
		if (progress % 100 === 0) {
			console.log(`modules ${progress}/${count}`);
		}
	}
};

export default updateModuleSummaries;
