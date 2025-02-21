import fs from 'fs';
import {getSearchModel} from '../core/models/module';
import {moduleCollection} from '../web/src/db/collections';
import {connectToMongo} from '../web/src/db/modern';

const start = async () => {
	console.log('Creating module index...');
	const objects: any[] = [];

	await connectToMongo();
	const count = await moduleCollection().countDocuments();
	let progress = 0;
	const cursor = moduleCollection().find();

	while (await cursor.hasNext()) {
		const mod = await cursor.next();
		if (!mod) {
			throw new Error('mod does not exist');
		}

		const {uni_identifier, university} = mod;

		objects.push({
			objectID: `${university}/${uni_identifier}`,
			...getSearchModel(mod),
		});
		progress++;
		if (progress % 100 === 0) {
			console.log(`modules ${progress}/${count}`);
		}
	}

	fs.writeFileSync('algolia-modules.json', JSON.stringify(objects));
};

export default start;
