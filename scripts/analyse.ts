import uniq from 'lodash/uniq';
import {truthy} from '../core/functions/truthy';
import {moduleCacheCollection} from '../web/src/db/collections';
import {connectToMongo} from '../web/src/db/modern';
import {parseDate} from '../web/src/helpers/parse-date';

const start = async () => {
	await connectToMongo();
	const modules = await moduleCacheCollection()
		.find({}, {fields: {'module.TestsDescription': 1}})
		.toArray();
	const repeatableTypes: string[] = uniq(
		modules.map((m) =>
			m.module.TestsDescription ? m.module.TestsDescription : null
		)
	);
	let i = 0;
	repeatableTypes.filter(truthy).forEach((rt) => {
		const date = parseDate(rt);
		if (date) {
			console.log('found date', i++, date, rt);
		}
	});
	console.log('done');
	process.exit(0);
};

start().catch((err) => console.error(err));
