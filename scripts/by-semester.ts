import xns from 'xns';
import {UZH} from '../core/models/university';
import {connectToMongo} from '../web/src/db/modern';
import {calculateUserCount} from '../web/src/helpers/calculate-user-count';

xns(async () => {
	await connectToMongo();
	return calculateUserCount(UZH, '50038004');
});
