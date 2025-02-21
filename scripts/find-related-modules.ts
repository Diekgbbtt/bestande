import execa from 'execa';
import fs from 'fs';
import countBy from 'lodash/countBy';
import shuffle from 'lodash/shuffle';
import sortBy from 'lodash/sortBy';
import toPairs from 'lodash/toPairs';
import xns from 'xns';
import {nextPeriod, previousPeriod} from '../core/functions/validate-period';
import {currentPeriod} from '../core/models/current-period';
import Module from '../core/models/module';
import {moduleCollection} from '../web/src/db/collections';
import {connectToMongo} from '../web/src/db/modern';

// Make DB dump:
// mongoexport --host xxx --username xxx --password xxx --db xxx --collection modulecollection --out modulecollection.csv --type csv --fields uni_identifier,university,period,user

const getRelated = async (
	uni_identifier: string,
	{next = false, previous = false} = {}
) => {
	let filteredDb = '';
	try {
		const x = await execa(
			'grep',
			['--', `${uni_identifier}`, 'modulecollection.csv'],
			{}
		);
		filteredDb = x.stdout;
	} catch (e) {
		return [];
	}

	const result = shuffle(filteredDb.split('\n').slice(0, 300));
	let semester = parseInt(result[0].split(',')[2], 10);
	if (previous) {
		semester = previousPeriod(semester);
	}

	if (next) {
		semester = nextPeriod(semester);
	}

	const command = `${semester},(${result
		.map((r) => r.split(',')[3].replace('ObjectId(', '').replace(')', ''))
		.join('|')})`;
	let hmm = '';
	try {
		const _hmm = await execa('grep', ['-E', command, 'modulecollection.csv']);
		hmm = _hmm.stdout;
	} catch (err) {
		return [];
	}

	const related = hmm
		.split('\n')
		.map((h) => h.split(','))
		.map((h) => ({
			uni_identifier: h[0],
			university: h[1],
			period: h[2],
			user: h[3],
		}));
	const counted = countBy(related, (r) => r.uni_identifier);
	const pairs = toPairs(counted);
	const sortedPairs = sortBy(pairs, (p) => 0 - p[1]).filter(
		(p) => p[0] !== uni_identifier
	);

	const res = sortedPairs.slice(0, 15).map(([moduleId, count]) => {
		return {
			module: moduleId,
			count,
		};
	});
	return res;
};

xns(async () => {
	let i = 0;
	if (fs.existsSync('related-progress.txt')) {
		i = Number(fs.readFileSync('related-progress.txt', 'utf8')) + 1;
	}

	await connectToMongo();
	let cursor = moduleCollection().find({
		'semesters.period': currentPeriod,
	});
	cursor = cursor.addCursorFlag('noCursorTimeout', true);
	const count = await cursor.skip(i).count();
	let j = 0;
	while (await cursor.hasNext()) {
		const {university, uni_identifier} = (await cursor.next()) as Module;
		console.log('Starting', uni_identifier);
		const [previous, same, next] = await Promise.all([
			getRelated(uni_identifier, {previous: true}),
			getRelated(uni_identifier),
			getRelated(uni_identifier, {next: true}),
		]);
		const mod = await moduleCollection().findOne({
			uni_identifier,
			university,
		});
		if (mod) {
			await moduleCollection().updateOne(
				{
					uni_identifier,
					university,
				},
				{
					$set: {
						previous,
						same,
						next,
					},
				}
			);
		}

		j++;
		fs.writeFileSync('related-progress.txt', String(j));
		console.log(`Finished ${j + 1} out of ${count}`);
	}
});
