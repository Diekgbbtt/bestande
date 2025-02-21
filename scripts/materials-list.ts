import dataToCsv from 'convert-array-to-csv';
import sortBy from 'lodash/sortBy';
import xns from 'xns';
import {ETH} from '../core/models/university';
import {moduleCollection} from '../web/src/db/collections';
import {connectToMongo} from '../web/src/db/modern';

xns(async () => {
	await connectToMongo();

	const modules = await moduleCollection()
		.find(
			{
				university: ETH,
			},
			{
				projection: {
					name: 1,
					uni_identifier: 1,
					'userCount.all': 1,
					'semesters.period': 1,
					'semesters.period_human': 1,
					'semesters.materials': 1,
					translatedNames: 1,
				},
			}
		)
		.sort({
			'userCount.all': -1,
		})
		.limit(500)
		.toArray();
	return dataToCsv(
		modules.map((m) => {
			const lastSemester = sortBy(m.semesters, (s) => s.period).reverse()[0];
			return {
				identifier: m.uni_identifier,
				name: m.name,
				users: m.userCount.all,
				semester: lastSemester.period_human,
				materials: lastSemester.materials,
				germanName: m.translatedNames?.find((t) => t.language === 'de')?.value,
			};
		})
	);
});
