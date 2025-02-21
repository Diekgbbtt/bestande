import xns from 'xns';
import {hashAllEmail} from '../hashing/hash-all-emails';
require('dotenv').config();

xns(async () => {
	console.log('Hashing all emails');
	await hashAllEmail();
});
