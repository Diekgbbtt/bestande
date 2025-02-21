import xns from 'xns';
import {ChatMessage} from '../core/actions/chat-server';
import {immutableReverse} from '../core/functions/immutable-reverse';
import {messagesCollection} from '../web/src/db/collections';
import {connectToMongo} from '../web/src/db/modern';

import countBy = require('lodash/countBy');
import toPairs = require('lodash/toPairs');
import sortBy = require('lodash/sortBy');

const words: string[] = [];

xns(async () => {
	await connectToMongo();

	const cursor = messagesCollection().find({}, {projection: {text: 1}});
	while (await cursor.hasNext()) {
		const review = (await cursor.next()) as ChatMessage;
		const reviewSplit = review.text.split(' ');
		for (const word of reviewSplit) {
			words.push(word.replace(/[.,]/g, ''));
		}
	}

	console.log(words.length);
	const counted = countBy(words, (w) => w);
	const pairs = toPairs(counted);
	const top200 = pairs.filter((p) => p[1] > 0 && p[0].length > 5);
	return immutableReverse(sortBy(top200, (t) => t[1])).slice(0, 50);
});
