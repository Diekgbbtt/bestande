import {RatingDeleted} from '../actions/delete-rating';
import {
	AddRatingRequest,
	ADD_RATING_REQUEST,
	ErrorAddingRating,
	ErrorReceivingRatings,
	ERROR_ADDING_RATING,
	RatingAdded,
	RATING_ADDED,
	RATING_DELETED,
	StarsUpdated,
	STARS_UPDATED,
} from '../actions/ratings';
import {interpolateRating} from '../functions/interpolate-ratings';
import {
	ModuleRatingsState,
	SingleModuleRatingState,
} from '../types/module-ratings-state';
import {
	CourseRating,
	ERROR_RECEIVING_RATING,
	FetchRatingAction,
	FetchRatingMore,
	FETCH_RATING,
	FETCH_RATING_MORE,
	ReceiveRatingAction,
	ReceiveRatingMore,
	RECEIVE_RATING,
	RECEIVE_RATING_MORE,
} from '../types/ratings';

const initialState: ModuleRatingsState = {
	addingRating: false,
	errorAddingRating: null,
	ratings: {},
};

export const moduleRatings = (
	state: ModuleRatingsState = initialState,
	action:
		| FetchRatingAction
		| ReceiveRatingAction
		| FetchRatingMore
		| ReceiveRatingMore
		| ErrorReceivingRatings
		| AddRatingRequest
		| RatingAdded
		| RatingDeleted
		| StarsUpdated
		| ErrorAddingRating
): ModuleRatingsState => {
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
							state.ratings[
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
								].data as CourseRating).ratings,
								...ratings.map((r) => r._id),
							],
						},
						error: null,
					},
				},
			};
		}

		case ERROR_RECEIVING_RATING:
			return {
				...state,
				ratings: {
					[`${action.institution}/${action.uni_identifier}/${action.sortOption}`]: {
						loading: false,
						data: null,
						error: action.err,
					},
				},
			};
		case ADD_RATING_REQUEST:
			return {
				...state,
				addingRating: true,
				errorAddingRating: null,
			};
		case RATING_ADDED: {
			const slug = `${action.rating.university}/${action.rating.uni_identifier}`;
			let modulerating: {[key: string]: SingleModuleRatingState} = {};
			if (state.ratings[slug]) {
				const rating = state.ratings[slug].data as CourseRating;
				modulerating = {
					[slug]: {
						...state.ratings[slug],
						data: {
							...rating,
							average: interpolateRating({
								averageRating: rating.average as number,
								totalRatings: rating.total,
								ratingToAdd: action.rating.score,
								ratingToRemove: null,
							}),
							total: rating.total + 1,
							overview: {
								...rating.overview,
								[action.rating.score]: rating.overview[action.rating.score] + 1,
							},
							ratings: [action.rating._id, ...rating.ratings],
						},
					},
				};
			}

			return {
				...state,
				addingRating: false,
				errorAddingRating: null,
				ratings: {
					...state.ratings,
					...modulerating,
				},
			};
		}

		case RATING_DELETED: {
			const slug = `${action.rating.university}/${action.rating.uni_identifier}`;
			let modulerating = {};
			if (state.ratings[slug]?.data) {
				const data = state.ratings[slug].data as CourseRating;
				modulerating = {
					[slug]: {
						...state.ratings[slug],
						data: {
							...state.ratings[slug].data,
							average: interpolateRating({
								averageRating: data.average as number,
								totalRatings: data.total,
								ratingToRemove: action.rating.score,
								ratingToAdd: null,
							}),
							total: data.total - 1,
							overview: {
								...data.overview,
								[action.rating.score]: data.overview[action.rating.score] - 1,
							},
							ratings: data.ratings.filter((r) => {
								return r !== action.rating._id;
							}),
						},
					},
				};
			}

			return {
				...state,
				...modulerating,
			};
		}

		case STARS_UPDATED: {
			const slug = `${action.rating.university}/${action.rating.uni_identifier}`;
			let modulerating = {};
			if (state.ratings[slug] && state.ratings[slug]) {
				const data = state.ratings[slug].data as CourseRating;
				modulerating = {
					[slug]: {
						...state.ratings[slug],
						data: {
							...data,
							average: interpolateRating({
								averageRating: data.average as number,
								totalRatings: data.total,
								ratingToRemove: action.oldScore,
								ratingToAdd: action.score,
							}),
							overview: {
								...data.overview,
								[action.score]: data.overview[action.score] + 1,
								[action.oldScore]: data.overview[action.oldScore] - 1,
							},
						},
					},
				};
			}

			return {
				...state,
				addingRating: false,
				errorAddingRating: null,
				...modulerating,
			};
		}

		case ERROR_ADDING_RATING:
			return {
				...state,
				addingRating: false,
				errorAddingRating: action.err,
			};
		default:
			return state;
	}
};
