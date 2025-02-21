import xns from 'xns';
import {immutableReverse} from '../core/functions/immutable-reverse';
import {ratingsCollection} from '../web/src/db/collections';
import {connectToMongo} from '../web/src/db/modern';

import countBy = require('lodash/countBy');
import toPairs = require('lodash/toPairs');
import sortBy = require('lodash/sortBy');

const words: string[] = [];

xns(async () => {
	await connectToMongo();
	const query = {
		date: {
			$gt: new Date('2019-01-01').getTime(),
			$lt: new Date('2019-12-31').getTime(),
		},
	};

	const cursor = ratingsCollection().find(
		{
			...query,
			review: {
				$ne: null,
			},
		},
		{projection: {review: 1}}
	);
	while (await cursor.hasNext()) {
		const review = await cursor.next();
		const reviewSplit = (review?.review as string).split(' ');
		for (const word of reviewSplit) {
			words.push(word.replace(/[.,]/g, '').toLowerCase());
		}
	}

	console.log(words.length);
	const counted = countBy(words, (w) => w);
	const pairs = toPairs(counted);
	const top200 = pairs.filter((p) => p[1] > 20 && p[0].length > 5);
	return immutableReverse(sortBy(top200, (t) => t[1])).slice(0, 50);
});
