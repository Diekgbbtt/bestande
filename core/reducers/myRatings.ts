import {RatingDeleted} from '../actions/delete-rating';
import {
	ErrorReceivingMyRatings,
	ERROR_RECEIVING_MY_RATINGS,
	FetchMyRatingsAction,
	FETCH_MY_RATINGS,
	RatingAdded,
	RATING_ADDED,
	RATING_DELETED,
	ReceiveMyRatingsAction,
	RECEIVE_MY_RATINGS,
	VoteAdded,
	VOTE_ADDED,
} from '../actions/ratings';
import {Institution} from '../models/credit';
import {MyRatingsState} from '../types/ratings';

const initialState: MyRatingsState = {
	loading: false,
	ratings: [],
	votes: {},
	error: null,
};

type Actions =
	| FetchMyRatingsAction
	| ReceiveMyRatingsAction
	| ErrorReceivingMyRatings
	| RatingAdded
	| RatingDeleted
	| VoteAdded;

const reducer = function (
	state: MyRatingsState = initialState,
	action: Actions,
	institution: Institution
): MyRatingsState {
	if (institution && institution !== action.institution) {
		return state;
	}

	switch (action.type) {
		case FETCH_MY_RATINGS:
			return {
				...state,
				loading: true,
				ratings: [],
				votes: {},
				error: null,
			};
		case RECEIVE_MY_RATINGS:
			return {
				...state,
				loading: false,
				ratings: action.ratings,
				votes: action.votes,
				error: null,
			};
		case ERROR_RECEIVING_MY_RATINGS:
			return {
				...state,
				loading: false,
				ratings: [],
				votes: {},
				error: action.err,
			};
		case RATING_ADDED:
			return {
				...state,
				ratings: [
					...state.ratings,
					{
						_id: action.rating._id,
						uni_identifier: action.rating.uni_identifier,
						university: action.rating.university,
					},
				],
			};
		case RATING_DELETED:
			return {
				...state,
				ratings: state.ratings.filter((r) => r._id !== action._id),
			};
		case VOTE_ADDED:
			return {
				...state,
				votes: {
					...state.votes,
					[action._id]: action.vote,
				},
			};
		default:
			return state;
	}
};

export const institutionReducer = (institution: Institution) => {
	return (state: MyRatingsState, action: Actions) =>
		reducer(state, action, institution);
};
