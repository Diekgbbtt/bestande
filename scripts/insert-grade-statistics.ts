import {ethGrades} from '../core/data/eth-grades';
import {getOnlyNumberIdentifier} from '../core/functions/get-only-number-identifier';
import {periodToString} from '../core/functions/uzh-period';
import {ETH} from '../core/models/university';
import * as gradeStatisticsDb from '../grade-statistics/db';

const start = async () => {
	if (!process.env.PGUSER) {
		return console.log('Postgres username is not defined');
	}

	await gradeStatisticsDb.connectGradeStatics();
	for (const grade of ethGrades) {
		try {
			await gradeStatisticsDb.insertPredefined({
				institution: ETH,
				source: grade.source,
				module: getOnlyNumberIdentifier(grade.uni_identifier),
				average: grade.average,
				semester: periodToString(grade.period),
				passed: grade.passed,
				failed: grade.failed,
				count: grade.passed + grade.failed,
				comment: null,
				source_link: null,
				stddev: null,
			});
			console.log('Inserted', grade.uni_identifier);
		} catch (err) {
			if (err.message.match(/duplicate/)) {
				console.log('Already exists', grade.uni_identifier);
			} else {
				console.log(err.message);
			}
		}
	}
};

start()
	.then(() => {
		console.log('done!');
	})
	.catch((err) => {
		console.log(err);
	});
