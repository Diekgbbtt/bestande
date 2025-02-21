import xns from 'xns';
import {moduleCollection} from '../web/src/db/collections';

xns(async () => {
	return moduleCollection()
		.find({'userCount.all': {$gt: 500}})
		.toArray();
});
