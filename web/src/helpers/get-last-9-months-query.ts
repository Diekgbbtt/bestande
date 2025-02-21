import {Institution} from '../../../core/models/credit';

export const getLast9MonthsQuery = (
	university: Institution,
	uni_identifier: string
) => {
	return {
		university,
		uni_identifier,
		date: {$gt: Date.now() - 24 * 30 * 24 * 60 * 60 * 1000},
	};
};
