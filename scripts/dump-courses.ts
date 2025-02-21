import fs from 'fs';
import xns from 'xns';
import {moduleCollection} from '../web/src/db/collections';
import {connectToMongo} from '../web/src/db/modern';

xns(async () => {
	await connectToMongo();
	const courses = await moduleCollection().find().toArray();
	await fs.promises.writeFile('courses.json', JSON.stringify(courses));
	return courses.length;
});
