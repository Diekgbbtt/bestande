import indexAlgolia from './index-algolia';
import updateModuleSummaries from './update-module-summaries';
import {uploadAlgolia} from './upload-algolia';
require('dotenv').config();

const start = async () => {
	await updateModuleSummaries();
	await indexAlgolia();
	await uploadAlgolia();
};

start()
	.then(() => {
		console.log('done');
		return process.exit(0);
	})
	.catch((err) => {
		console.log({err});
	});
