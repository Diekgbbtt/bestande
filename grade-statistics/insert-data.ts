import fs from 'fs';
import junk from 'junk';
import path from 'path';
import xns from 'xns';
import {insertPredefined} from './db';

xns(async () => {
	const files = fs
		.readdirSync(path.join(__dirname, '..', 'data'))
		.filter((f) => junk.not(f));

	for (const file of files) {
		const fileContent = JSON.parse(
			fs.readFileSync(path.join(__dirname, '..', 'data', file), 'utf8')
		);
		try {
			await insertPredefined(fileContent);
			console.log(`inserted ${file}`);
		} catch (error) {
			if (error.code === '23505') {
				console.log(`${file} was already inserted`);
			} else {
				throw error;
			}
		}
	}
});
