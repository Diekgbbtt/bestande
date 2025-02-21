import {
	RatingState,
	ReceiveRatingAction,
	ReceiveRatingMore,
	RECEIVE_RATING,
	RECEIVE_RATING_MORE,
} from '../../../core/types/ratings';

const initialState: RatingState = {};

export const ratings = (
	state: RatingState = initialState,
	action: ReceiveRatingAction | ReceiveRatingMore
): RatingState => {
	switch (action.type) {
		case RECEIVE_RATING: {
			const obj = {};
			for (const rating of action.data.ratings) {
				obj[rating._id] = rating;
			}

			return {
				...state,
				...obj,
			};
		}

		case RECEIVE_RATING_MORE: {
			const obj = {};
			for (const rating of action.data.ratings) {
				obj[rating._id] = rating;
			}

			return {...state, ...obj};
		}

		default:
			return state;
	}
};
