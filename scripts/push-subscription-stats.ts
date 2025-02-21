import sortBy from 'lodash/sortBy';
import xns from 'xns';
import {Institution} from '../core/models/credit';
import {moduleCollection, userCollection} from '../web/src/db/collections';
import {connectToMongo} from '../web/src/db/modern';

xns(async () => {
	await connectToMongo();
	const peopleWithSubscriptions = userCollection().find(
		{},
		{projection: {pushSubscriptions: 1}}
	);
	const map = {};
	while (await peopleWithSubscriptions.hasNext()) {
		const sub = await peopleWithSubscriptions.next();
		if (sub?.pushSubscriptions) {
			for (const subscription of sub.pushSubscriptions) {
				if (!map[subscription]) {
					map[subscription] = 0;
				}

				map[subscription]++;
			}
		}
	}

	const facultyMap = {};
	const assessmentMap = {true: 0, false: 0};
	const keys = sortBy(Object.keys(map), (k) => 0 - map[k]);
	let i = 0;
	for (const key of keys) {
		i++;
		const uni = key.substr(0, 3);
		const id = key.substr(3);

		const mod = await moduleCollection().findOne(
			{
				uni_identifier: id,
				university: uni.toUpperCase() as Institution,
			},
			{
				projection: {
					short_name: 1,
					userCount: 1,
					faculty: 1,
					departments: 1,
					uni_identifier: 1,
					slug: 1,
				},
			}
		);
		const slugs = [
			'financial-accounting',
			'bwl1',
			'mikro1',
			'mathe1',
			'bwl2',
			'statistik',
			'mathe2',
			'makro1',
			'makro2',
		];
		const isAssessment =
			slugs.some((s) => mod?.slug?.some((sl) => sl.includes(s))) ||
			mod?.uni_identifier === '50821425' ||
			mod?.uni_identifier === '50820164' ||
			mod?.uni_identifier === '50819883' ||
			mod?.uni_identifier === '50873019' ||
			mod?.uni_identifier === '50314878';
		assessmentMap[String(isAssessment)] += map[key];
		if (mod?.faculty) {
			if (!facultyMap[mod.faculty]) {
				facultyMap[mod.faculty] = 0;
			}

			facultyMap[mod.faculty] += map[key];
		}

		console.log(`${i}/${keys.length}`);
	}

	console.log({facultyMap, assessmentMap});
});
