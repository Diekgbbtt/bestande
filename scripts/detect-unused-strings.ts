import util from 'util';
import xns from 'xns';
import rawStrings from '../core/raw-strings';

const execPromise = util.promisify(require('child_process').exec);

xns(async () => {
	const strings = rawStrings;
	const values = Object.keys(strings);
	const unused: string[] = [];
	for (const value of values) {
		try {
			const {stdout} = await execPromise(`git grep -o "${value}"`);
			const occurences = (stdout as string)
				.split('\n')
				.filter((s) => !s.includes('raw-strings.ts'))
				.filter(Boolean);
			if (occurences.length === 0) {
				unused.push(value);
			}
		} catch (err) {
			if (err.code === 1) {
				unused.push(value);
			} else {
				throw err;
			}
		}
	}

	if (unused.length === 0) {
		console.log('✅  There are no unused translations');
	} else {
		console.warn(
			`⚠️  There ${
				unused.length === 1
					? 'is one'
					: `are ${unused.length} unused translations: ${unused.join(', ')}`
			}`
		);
	}
});
