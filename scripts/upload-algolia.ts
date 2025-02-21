import fs from 'fs';
import got from 'got';
import chunk from 'lodash/chunk';

const ALGOLIA_INDEX_NAME = 'modules-including-FS25';

const APPLICATION_ID = '299XCMNA4R';

const uploadModules = async () => {
	const file = fs.readFileSync('algolia-modules.json', 'utf8');
	const modules = JSON.parse(file);
	const chunks = chunk(modules, 1000);
	for (const part of chunks) {
		const response = await got
			.post(
				`https://${APPLICATION_ID}.algolia.net/1/indexes/${ALGOLIA_INDEX_NAME}/batch`,
				{
					headers: {
						accept: 'application/json',
						'Content-Type': 'application/json',
						'X-Algolia-API-Key': process.env.ALGOLIA_PRIVATE_KEY,
						'X-Algolia-Application-Id': APPLICATION_ID,
					},
					body: JSON.stringify({
						requests: part.map((c) => ({
							action: 'addObject',
							body: c,
						})),
					}),
				}
			)
			.catch((err) => {
				console.error('Failed to execute batch operation:', err);
			});

		if (response?.body) {
			console.log('Batch operation successful:', response.body);
		}
	}
};

export const uploadAlgolia = async () => {
	await uploadModules();
};

