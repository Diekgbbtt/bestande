import assert from 'assert';
import differenceInHours from 'date-fns/differenceInHours';
import isValid from 'date-fns/isValid';
import fs from 'fs';
import omit from 'lodash/omit';
import neatCsv from 'neat-csv';
import path from 'path';
import xns from 'xns';
import {DatabaseUser} from '../core/actions/users';
import {mapToUniversity} from '../core/functions/uni-slug';
import {AppLanguage} from '../core/models/app-language';
import {Institution} from '../core/models/credit';
import {ExamReturnStatistic} from '../core/types/types';
import {examReturnsCollection, userCollection} from '../web/src/db/collections';
import {connectToMongo} from '../web/src/db/modern';
import {adjustZurichTimezone} from '../web/src/helpers/adjust-zurich-timezone';
import {notifyExamGradeReporterViaPush} from '../web/src/helpers/notify-exam-grade-reporter-via-push';

xns(async () => {
	await connectToMongo();
	const returnsCsv = await fs.promises.readFile(
		path.resolve(__dirname, '../web/src/data/exam_returns.csv'),
		'utf8'
	);
	const table = await neatCsv(returnsCsv);
	const onlyFilled = table.filter((t) => t.link);
	for (const t of onlyFilled) {
		const start_date = adjustZurichTimezone(new Date(t.exam_date));
		const end_date = adjustZurichTimezone(new Date(t.return_date));
		const uni_identifier = t.link.split('/')[4];
		const university = mapToUniversity(t.link.split('/')[3]);
		const reporter = await userCollection().findOne({username: t.reporter});
		assert.equal(true, isValid(start_date));
		assert.equal(true, isValid(end_date));
		assert.notEqual(false, Boolean(uni_identifier));
		assert.notEqual(false, Boolean(t.semester));
		assert.notEqual(false, university);

		const statistic: ExamReturnStatistic = {
			exam_date: start_date.getTime(),
			return_date: end_date.getTime(),
			uni_identifier,
			university: university as Institution,
			reporter: reporter?.id as string,
			chatLanguage: t.lang as AppLanguage,
			differenceInHours: differenceInHours(end_date, start_date),
			period: Number(t.semester),
			comment: t.comment ? t.comment : undefined,
			reporterNotifiedViaPush: true,
		};
		const exists = await examReturnsCollection().findOne({
			uni_identifier: statistic.uni_identifier,
			university: statistic.university,
			period: statistic.period,
		});
		if (exists?.reporter) {
			const newReporter = await userCollection().findOne({
				id: exists.reporter as string,
			});
			if (!exists.reporterNotifiedViaPush) {
				await notifyExamGradeReporterViaPush({
					reporter: newReporter as DatabaseUser,
					statistic,
					uni_identifier,
					university,
				});
			}

			await examReturnsCollection().updateOne(
				{
					uni_identifier: statistic.uni_identifier,
					university: statistic.university,
					period: statistic.period,
				},
				{$set: omit(statistic, 'reporter')}
			);
		} else {
			if (!reporter) {
				throw new Error('No reporter with username ' + t.reporter);
			}

			await examReturnsCollection().insertOne(statistic);
			await notifyExamGradeReporterViaPush({
				reporter: reporter as DatabaseUser,
				statistic,
				uni_identifier,
				university,
			});
		}

		console.log(statistic.uni_identifier, statistic.university);
	}
});
