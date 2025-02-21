import sortBy from 'lodash/sortBy';
import xns from 'xns';
import {immutableReverse} from '../core/functions/immutable-reverse';
import Module from '../core/models/module';
import {moduleCollection} from '../web/src/db/collections';
import {connectToMongo} from '../web/src/db/modern';

xns(async () => {
	await connectToMongo();
	const cursor = moduleCollection().find({
		'semesters.materials': /ISBN/,
	});

	let matches = 0;

	while (await cursor.hasNext()) {
		const rgx_10_13 = /(?:(?:-13)?:? *(97(?:8|9)([ -]?)(?=\d{1,5}\2?\d{1,7}\2?\d{1,6}\2?\d)(?:\d\2*){9}\d))/i;

		const next = (await cursor.next()) as Module;
		const newestSemester = immutableReverse(
			sortBy(next.semesters, (s) => s.period)
		)[0];

		if (newestSemester.materials?.match(rgx_10_13)) {
			console.log(`> ${next.short_name}`);
			console.log(rgx_10_13.exec(newestSemester.materials)?.[1]);
			matches++;
		}
	}

	console.log(
		'There are ',
		await cursor.count(),
		' modules with ISBN and ',
		matches,
		'could be parsed'
	);
});
