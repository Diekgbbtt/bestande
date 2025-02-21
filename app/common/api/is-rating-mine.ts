import {createSelector} from 'reselect';
import {AppState} from '../../../core/types/app-state';

export const isRatingMine = createSelector(
	[
		(state: AppState) => state.multiMyRatings[state.institution.institution],
		(state: AppState, id: string) => id,
	],
	(myRatings, id: string): boolean => {
		return Boolean(myRatings.ratings.find((r) => r._id === id));
	}
);
