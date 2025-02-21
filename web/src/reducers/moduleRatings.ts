import {ModuleRatingsState} from '../../../core/types/module-ratings-state';
import {
	FetchRatingAction,
	FetchRatingMore,
	FETCH_RATING,
	FETCH_RATING_MORE,
	ReceiveRatingAction,
	ReceiveRatingMore,
	RECEIVE_RATING,
	RECEIVE_RATING_MORE,
} from '../../../core/types/ratings';

type Action =
	| FetchRatingAction
	| ReceiveRatingAction
	| FetchRatingMore
	| ReceiveRatingMore;

const initialState: ModuleRatingsState = {
	ratings: {},
	addingRating: false,
	errorAddingRating: null,
};

export const moduleRatings = function (
	state: ModuleRatingsState = initialState,
	action: Action
): ModuleRatingsState {
	switch (action.type) {
		case FETCH_RATING:
			return {
				...state,
				ratings: {
					...state.ratings,
					[`${action.institution}/${action.uni_identifier}/${action.sortOption}`]: {
						loading: true,
						data: null,
						error: null,
						loadingMore: false,
					},
				},
			};
		case RECEIVE_RATING: {
			const {ratings, ...data} = action.data;
			return {
				...state,
				ratings: {
					...state.ratings,
					[`${action.institution}/${action.uni_identifier}/${action.sortOption}`]: {
						loading: false,
						data: {
							...data,
							ratings: ratings.map((r) => r._id),
						},
						error: null,
						loadingMore: false,
					},
				},
			};
		}

		case FETCH_RATING_MORE: {
			return {
				...state,
				ratings: {
					...state.ratings,
					[`${action.institution}/${action.uni_identifier}/${action.sortOption}`]: {
						loading: false,
						loadingMore: true,
						data:
							state[
								`${action.institution}/${action.uni_identifier}/${action.sortOption}`
							].data,
						error: null,
					},
				},
			};
		}

		case RECEIVE_RATING_MORE: {
			const {ratings, ...data} = action.data;
			return {
				...state,
				ratings: {
					...state.ratings,
					[`${action.institution}/${action.uni_identifier}/${action.sortOption}`]: {
						loading: false,
						loadingMore: false,
						data: {
							...data,
							ratings: [
								...(state.ratings[
									`${action.institution}/${action.uni_identifier}/${action.sortOption}`
								].data?.ratings as string[]),
								...ratings.map((r) => r._id),
							],
						},
						error: null,
					},
				},
			};
		}

		default:
			return state;
	}
};
