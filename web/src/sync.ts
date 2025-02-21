import xns from 'xns';
import {
	eventCollection,
	impressionsCollection,
	moduleCollection,
	moduleCollectionCollection,
	peopleCollection,
	ratingsCollection,
} from './db/collections';
import {ensureChatMessageIndex} from './db/ensure-chat-message-index';
import {connectToMongo} from './db/modern';

xns(async () => {
	await connectToMongo();
	await moduleCollection().createIndex(
		{
			name: 'text',
			short_name: 'text',
		},
		{
			name: 'ModuleSearchIndex',
		}
	);
	await moduleCollection().createIndex(
		{
			uni_identifier: 1,
			university: 1,
		},
		{
			name: 'ModuleIdIndex',
		}
	);
	await peopleCollection().createIndex(
		{
			name: 'text',
		},
		{
			name: 'PeopleSearchIndex',
		}
	);
	await peopleCollection().createIndex(
		{
			uni_identifier: 1,
		},
		{
			name: 'PeopleUniIndex',
		}
	);
	await eventCollection().createIndex(
		{
			event_serie_id: 1,
			university: 1,
			period: 1,
		},
		{
			name: 'EventIndex',
		}
	);
	await eventCollection().createIndex(
		{
			event_serie_id: 1,
		},
		{
			name: 'EventSerieIndex',
		}
	);
	await ratingsCollection().createIndex(
		{
			uni_identifier: 1,
			university: 1,
		},
		{
			name: 'RatingsIndex',
		}
	);
	await ratingsCollection().createIndex(
		{
			date: -1,
		},
		{
			name: 'ReviewSort',
		}
	);
	await moduleCollectionCollection().createIndex(
		{
			user: 1,
		},
		{
			name: 'ModuleCollectionUserIndex',
		}
	);
	await impressionsCollection().createIndex(
		{
			content_id: 1,
		},
		{
			name: 'ImpressionContentIdIndex',
		}
	);
	await ensureChatMessageIndex();
});
