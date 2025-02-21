import neatCsv from 'convert-array-to-csv';
import fs from 'fs';
import xns from 'xns';
import {Institution} from '../core/models/credit';
import {connectGradeStatics} from '../grade-statistics/db';
import {moduleCollection, ratingsCollection} from '../web/src/db/collections';
import {connectToMongo} from '../web/src/db/modern';

const cache = {};

let idCounter = 0;

const idMap = {};
const getIdDataset = (hash: string) => {
	if (idMap[hash]) {
		return idMap[hash];
	}

	const id = ++idCounter;
	idMap[hash] = id;

	return idMap[hash];
};

const getModData = async (uni_identifier: string, university: Institution) => {
	const cacheKey = [uni_identifier, university].join();
	if (cache[cacheKey]) {
		return cache[cacheKey];
	}

	const modData = await moduleCollection().findOne({
		uni_identifier,
		university,
	});
	cache[cacheKey] = modData;
	return modData;
};

xns(async () => {
	await connectGradeStatics();
	await connectToMongo();

	const ratings = await ratingsCollection().find().toArray();
	const processed: any[] = [];
	let i = 0;
	for (const row of ratings) {
		console.log(++i);
		const modData = await getModData(row.uni_identifier, row.university);
		processed.push({
			university: row.university,
			review: row.review?.replace(/\\n/g, ' '),
			uni_identifier: row.uni_identifier,
			rating: row.score,
			date: row.date,
			student: 'user-' + getIdDataset(row?.token ?? '0'),
			module_name: modData?.name ?? 'N/A',
			module_short_name: modData?.short_name ?? 'N/A',
			department: [...(modData?.departments ?? []), modData?.faculty ?? null]
				.filter(Boolean)
				.join(','),
			user_count: modData?.userCount.all,
		});
	}

	const data = neatCsv(processed);
	fs.writeFileSync('moduless.csv', data);
});
