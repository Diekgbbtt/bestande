import {createSelector} from 'reselect';
import {Institution} from '../models/credit';
import {AppState} from '../types/app-state';
import {SingleModuleRatingState} from '../types/module-ratings-state';
import {RatingSortOption} from '../types/ratings';
import {WebState} from '../types/web-state';

const initialItemState: SingleModuleRatingState = {
	loading: false,
	data: null,
	error: null,
	loadingMore: false,
};

export const getRatingsStateForModule = createSelector(
	[
		(state: AppState | WebState) => state,
		(state: AppState | WebState) => state.moduleRatings,
		(state: AppState | WebState, institution: Institution) => institution,
		(
			state: AppState | WebState,
			institution: Institution,
			uni_identifier: string
		) => uni_identifier,
		(
			state: AppState | WebState,
			institution: Institution,
			uni_identifier: string,
			sortOption: RatingSortOption
		) => sortOption,
		(
			state: AppState | WebState,
			institution: Institution,
			uni_identifier: string,
			sortOption: RatingSortOption,
			email: string
		) => email,
	],
	(
		state,
		ratings,
		institution,
		uni_identifier,
		sortOption,
		email
	): SingleModuleRatingState => {
		return (
			ratings?.ratings?.[`${institution}/${uni_identifier}/${sortOption}`] ||
			initialItemState
		);
	}
);
