import {Router} from 'express';
import {truthy} from '../../../../core/functions/truthy';
import {ExpandedExamReturnStatistic} from '../../../../core/types/types';
import {examReturnsCollection, userCollection} from '../../db/collections';
import {asyncHandler} from '../../handlers';
import {databaseUserToUser} from '../../helpers/database-user-to-user';

const router = Router();

router.get(
	'/',

	asyncHandler(async (request, response) => {
		const returns = await examReturnsCollection()
			.find({
				uni_identifier: response.locals.module.uni_identifier,
				university: response.locals.module.university,
			})
			.toArray();
		const userIds = returns.map((r) => r.reporter).filter(truthy);
		const users = await userCollection()
			.find({
				id: {$in: userIds},
			})
			.toArray();
		const mapped: ExpandedExamReturnStatistic[] = returns.map((r) => {
			const user = users.find((u) => u.id === r.reporter);
			return {
				...r,
				reporter: user ? databaseUserToUser(user) : null,
			};
		});
		return {
			semesters: mapped,
		};
	})
);

export default router;
