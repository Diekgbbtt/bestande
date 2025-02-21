import {getModuleId} from '../../../core/functions/get-module-id';
import {Credit} from '../../../core/models/credit';
import {MyRating} from '../../../core/types/ratings';

const hasBeenRated = (ratings: MyRating[], credit: Credit) => {
	return ratings.find((myRating) => {
		return (
			myRating.university === credit.institution &&
			myRating.uni_identifier === getModuleId(credit)
		);
	});
};

export const getUnratedCredits = (
	visibleCredits: Credit[],
	ratings: MyRating[]
) => {
	return visibleCredits
		.filter((credit) => getModuleId(credit) && credit.institution)
		.filter(
			(credit) => credit.status === 'PASSED' || credit.status === 'FAILED'
		)
		.filter((credit) => {
			return !hasBeenRated(ratings, credit);
		});
};
