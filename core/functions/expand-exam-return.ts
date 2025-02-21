import {userCollection} from '../../web/src/db/collections';
import {databaseUserToUser} from '../../web/src/helpers/database-user-to-user';
import {ExamReturnStatistic} from '../types/types';

export const expandExamReturn = async (e: ExamReturnStatistic) => {
	if (!e.reporter) {
		return {
			...e,
			reporter: null,
		};
	}

	const user = await userCollection().findOne({
		id: e.reporter,
	});
	if (!user) {
		return {
			...e,
			reporter: null,
		};
	}

	return {
		...e,
		reporter: databaseUserToUser(user),
	};
};
