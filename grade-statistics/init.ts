import xns from 'xns';
import {createIndices, createTables} from './db';

xns(async () => {
	// await db.reset();
	await createTables();
	await createIndices();
});
