import {getOnlyNumberIdentifier} from '../../../core/functions/get-only-number-identifier';
import {parseCourseCode} from '../../../core/functions/parse-course-code';
import {Institution} from '../../../core/models/credit';
import Module from '../../../core/models/module';
import {Job} from '../../../core/types/types';
import * as gradeStatisticsDb from '../../../grade-statistics/db';
import {isModuleInBlacklist} from '../../../grade-statistics/grade-statistics-blacklist';
import {
	messagesCollection,
	moduleCollection,
	ratingsCollection,
} from '../db/collections';
import {connectToMongo} from '../db/modern';
import {calculateUserCount} from '../helpers/calculate-user-count';
import {getLast9MonthsQuery} from '../helpers/get-last-9-months-query';

const updateModuleStats = async (
	job: Job<{
		uni_identifier?: string;
		university?: Institution;
		_mod?: Module;
	}>
) => {
	await connectToMongo();
	const {uni_identifier, university, _mod} = job.attrs.data;
	const mod =
		_mod ||
		((await moduleCollection().findOne({
			uni_identifier,
			university,
		})) as Module);
	mod.userCount = await calculateUserCount(mod.university, mod.uni_identifier);
	const messageCount = await messagesCollection().countDocuments({
		university: mod.university,
		uni_identifier: mod.uni_identifier,
	});
	mod.messages = messageCount;

	mod.courseCode = parseCourseCode(mod.name as string, mod.university);

	const totalRatings = await ratingsCollection().countDocuments(
		getLast9MonthsQuery(mod.university, mod.uni_identifier)
	);
	const averageRatings = await ratingsCollection()
		.aggregate([
			{
				$match: getLast9MonthsQuery(mod.university, mod.uni_identifier),
			},
			{
				$group: {_id: '$objectId', average: {$avg: '$score'}},
			},
		])
		.toArray();
	// @ts-expect-error
	const avgScore: number = (averageRatings?.[0]?.average as number) ?? 0;
	mod.ratingSummary = {
		average: totalRatings === 0 ? NaN : avgScore,
		total: totalRatings,
	};

	if (process.env.PGUSER) {
		if (isModuleInBlacklist(mod.university, mod.uni_identifier)) {
			mod.gradeStatistics = {
				passed: null,
				failed: null,
				count: null,
				average: null,
			};
		} else {
			await gradeStatisticsDb.connectGradeStatics();
			const predefined = await gradeStatisticsDb.getPredefined(
				String(getOnlyNumberIdentifier(mod.uni_identifier)),
				mod.university
			);
			const totalStats = await gradeStatisticsDb.getTotalStats(
				String(getOnlyNumberIdentifier(mod.uni_identifier)),
				mod.university
			);
			mod.gradeStatistics = gradeStatisticsDb.reducePredefined(
				predefined.rows.concat(totalStats.rows)
			);
		}
	}

	await moduleCollection().updateOne(
		{
			uni_identifier: mod.uni_identifier,
			university: mod.university,
		},
		{
			$set: mod,
		},
		{
			upsert: true,
		}
	);
	return mod;
};

export default updateModuleStats;
