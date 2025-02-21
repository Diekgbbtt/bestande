import omit from 'lodash/omit';
import {
	DeletingRatingAction,
	ErrorDeletingRating,
	RatingDeleted,
} from '../actions/delete-rating';
import {
	DELETING_RATING,
	ErrorReceivingMyRatings,
	ErrorReceivingRatings,
	ErrorUpdatingRating,
	ERROR_DELETING_RATING,
	ERROR_UPDATING_RATING,
	FetchMyRatingsAction,
	RatingAdded,
	RatingUpdated,
	RATING_ADDED,
	RATING_DELETED,
	RATING_UPDATED,
	ReceiveMyRatingsAction,
	UpdateRatingRequest,
	UPDATE_RATING_REQUEST,
	VoteAdded,
	VOTE_ADDED,
} from '../actions/ratings';
import {
	FetchRatingAction,
	FetchRatingMore,
	RatingCore,
	RatingsState,
	ReceiveRatingAction,
	ReceiveRatingMore,
	RECEIVE_RATING,
	RECEIVE_RATING_MORE,
	Voting,
} from '../types/ratings';

const initialState: RatingsState = {};

const computeNewVoting = (
	rating: RatingCore,
	previousVote: Voting,
	vote: Voting
): {
	ups: number;
	downs: number;
} => {
	const obj: {
		ups: number;
		downs: number;
	} = {
		ups: rating.ups ?? 0,
		downs: rating.downs ?? 0,
	};
	if (vote === 'up' && previousVote !== 'up') {
		obj.ups = Number(rating.ups) + 1;
	}

	if (vote !== 'up' && previousVote === 'up') {
		obj.ups = Number(rating.ups) - 1;
	}

	if (vote === 'down' && previousVote !== 'down') {
		obj.downs = Number(rating.downs) + 1;
	}

	if (vote !== 'down' && previousVote === 'down') {
		obj.downs = Number(rating.downs) - 1;
	}

	return obj;
};

type Actions =
	| ReceiveMyRatingsAction
	| ErrorReceivingMyRatings
	| FetchMyRatingsAction
	| DeletingRatingAction
	| RatingDeleted
	| ErrorDeletingRating
	| FetchRatingAction
	| ReceiveRatingAction
	| ErrorReceivingRatings
	| FetchRatingMore
	| ReceiveRatingMore
	| UpdateRatingRequest
	| RatingUpdated
	| ErrorUpdatingRating
	| RatingAdded
	| VoteAdded;

export const ratings = (
	state: RatingsState = initialState,
	action: Actions
): RatingsState => {
	switch (action.type) {
		case RECEIVE_RATING_MORE: {
			const obj: {[key: string]: RatingCore} = {};
			for (const rating of action.data.ratings) {
				obj[rating._id] = rating;
			}

			return {
				...state,
				...obj,
			};
		}

		case RECEIVE_RATING: {
			const obj: {[key: string]: RatingCore} = {};
			for (const rating of action.data.ratings) {
				obj[rating._id] = rating;
			}

			return {
				...state,
				...obj,
			};
		}

		case DELETING_RATING: {
			return {
				...state,
				[action._id]: {
					...state[action._id],
					deleting: true,
				},
			};
		}

		case RATING_DELETED: {
			return omit(state, action._id);
		}

		case ERROR_DELETING_RATING:
			return {
				...state,
				[action._id]: {
					...state[action._id],
					deleting: false,
				},
			};
		case UPDATE_RATING_REQUEST:
			return {
				...state,
				[action._id]: {
					...state[action._id],
					updating: true,
				},
			};
		case RATING_UPDATED:
			return {
				...state,
				[action._id]: {
					...state[action._id],
					updating: false,
					...{
						...action.rating,
						_id: action._id as string,
					},
				},
			};
		case ERROR_UPDATING_RATING:
			return {
				...state,
				[action._id]: {
					...state[action._id],
					updating: false,
				},
			};
		case RATING_ADDED:
			return {
				...state,
				[action.rating._id]: action.rating,
			};
		case VOTE_ADDED:
			return {
				...state,
				[action._id]: {
					...state[action._id],
					...computeNewVoting(
						state[action._id],
						action.previousVote,
						action.vote
					),
				},
			};
		default:
			return state;
	}
};
