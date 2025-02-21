import fs from 'fs';
import last from 'lodash/last';
import min from 'lodash/min';
import sortBy from 'lodash/sortBy';
import neatCsv from 'neat-csv';
import path from 'path';
import xns from 'xns';
import {getOnlyNumberIdentifier} from '../core/functions/get-only-number-identifier';
import {immutableReverse} from '../core/functions/immutable-reverse';
import {periodToString} from '../core/functions/uzh-period';
import {ETH} from '../core/models/university';
import * as gradeStatisticsDb from '../grade-statistics/db';
import {connectGradeStatics} from '../grade-statistics/db';
import {moduleCollection} from '../web/src/db/collections';

// eslint-disable-next-line complexity
xns(async () => {
	if (!process.env.PGUSER) {
		return console.log('Postgres username is not defined');
	}

	const csv = fs.readFileSync(
		path.resolve(__dirname, '../web/src/data/grade-statistics.csv'),
		'utf8'
	);
	await connectGradeStatics();
	let results: any[] = [];
	let dbNames: string[] = [];
	let average: number[] = [];
	let percent: string[] = [];
	let yo: any[] = [];
	const table = await neatCsv(csv);
	for (const row of table) {
		const link: string[] = row['Answer.url'].split(',');
		const names = row['Input.course_name'].split(',').map((x) => x.trim());
		if (link.length !== names.length) {
			console.log(row);
			throw new Error('Length does not match up');
		}

		for (let i = 0; i < link.length; i++) {
			const id = link[i];
			const uni_identifier = last(id.split('/'))?.trim();
			const passed = parseFloat(row['Answer.passed']);
			const failed = parseFloat(row['Answer.failed']);
			const total = parseFloat(row['Answer.total']);
			const result: any = {
				source: row.Source,
				average: parseFloat(row['Answer.average']),
				module: getOnlyNumberIdentifier(uni_identifier || null),
				institution: ETH,
				stddev: row['Answer.stddev'] ? parseFloat(row['Answer.stddev']) : null,
			};
			if (/%/.exec(row['Answer.passed']) && /%/.exec(row['Answer.failed'])) {
				if (passed + failed !== 100) {
					throw new Error(`Should result to 100% (is ${passed + failed})`);
				}

				result.passed = Math.round((passed * total) / 100);
				result.failed = Math.round((failed * total) / 100);
			} else if (
				!/%/.exec(row['Answer.passed']) &&
				!/%/.exec(row['Answer.failed'])
			) {
				if (passed + failed !== total) {
					throw new Error(`Should result to ${total} (is ${passed + failed})`);
				}

				result.passed = passed;
				result.failed = failed;
			} else {
				throw new Error('Must be all percent or none');
			}

			if (result.average < 1) {
				throw new Error('Average must be gte 1');
			}

			if (result.average > 6) {
				throw new Error('Average must be lte 6');
			}

			if (result.passed % 1 > 0) {
				console.log(result);
				throw new Error('Passed must be integer');
			}

			if (result.failed % 1 > 0) {
				console.log(result);
				throw new Error('Passed must be integer');
			}

			const dbCredit = await moduleCollection().findOne({uni_identifier});
			if (!dbCredit) {
				console.log(dbCredit);
				throw new Error('Did not find in database');
			}

			const releasePeriod = Number(row['Release period']);
			const periods = immutableReverse(
				sortBy(
					dbCredit.semesters.map((s) => s.period),
					(p) => p
				)
			);
			const examPeriod =
				periods.find((p) => p < releasePeriod) || Number(min(periods)) - 10;
			if (examPeriod > releasePeriod) {
				throw new Error('should not be');
			}

			result.semester = periodToString(examPeriod);
			result.source_link = row['Input.website_url'];
			let comments: string[] = [];
			if (
				result.source_link === 'https://blitz.ethz.ch/pdf/HS17/blitz01_issu.pdf'
			) {
				comments = [
					...comments,
					'Normiert auf n = 100 (Anzahl Studenten nicht veröffentlicht)',
				];
			}

			if (link.length === 2) {
				comments = [
					...comments,
					`Prüfung beinhaltete auch ${names
						.filter((_, j) => j !== i)
						.join('')}`,
				];
			}

			if (comments.length > 0) {
				result.comment = comments.join('\n');
			}

			results = [...results, result];
			dbNames = [...dbNames, dbCredit.name as string];
			average = [...average, result.average];
			percent = [
				...percent,
				Math.round((result.passed / (result.passed + result.failed)) * 100) +
					'%',
			];
			yo = [
				...yo,
				[
					dbCredit.name,
					result.average,
					Math.round((result.passed / (result.passed + result.failed)) * 100) +
						'%',
				],
			];
			try {
				await gradeStatisticsDb.insertPredefined(result);
				console.log('inserted');
			} catch (err) {
				if (err.message.match(/duplicate/)) {
					console.log('Already exists', result.module);
				} else {
					console.log(err.message);
				}
			}
		}
	}

	fs.writeFileSync(
		'names.txt',
		sortBy(
			require('lodash').uniqBy(yo, (_yo) => _yo[0]),
			(y) => y[0]
		)
			.map((y) => y[0])
			.join('\n')
	);
	fs.writeFileSync(
		'averages.txt',
		sortBy(
			require('lodash').uniqBy(yo, (_yo) => _yo[0]),
			(y) => y[0]
		)
			.map((y) => y[1])
			.join('\n')
	);
	fs.writeFileSync(
		'percentages.txt',
		sortBy(
			require('lodash').uniqBy(yo, (_yo) => _yo[0]),
			(y) => y[0]
		)
			.map((y) => y[2])
			.join('\n')
	);
});
