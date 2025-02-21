import xns from 'xns';
import {messagesCollection} from './collections';
import {connectToMongo} from './modern';

export const ensureChatMessageIndex = xns(async () => {
	await connectToMongo();
	await messagesCollection().createIndex({
		createdAt: 1,
		uni_identifier: 1,
		university: 1,
	});
});
