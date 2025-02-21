import fs from 'fs';
import xns from 'xns';
import Module from '../core/models/module';
import {moduleCollection} from '../web/src/db/collections';
import {connectToMongo} from '../web/src/db/modern';
import {dbUrl} from '../web/src/db/url';

xns(async () => {
	if (!dbUrl().includes('localhost')) {
		throw new Error('can only load localhost');
	}

	connectToMongo();
	const courses: Module[] = JSON.parse(
		await fs.promises.readFile('courses.json', 'utf-8')
	);
	for (const course of courses) {
		await moduleCollection().insertOne(course);
		console.log('loaded', course.name);
	}
});
