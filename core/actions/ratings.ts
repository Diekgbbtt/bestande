import {Alert} from 'react-native-normalized';
import {
	getMyRatings,
	getRatings,
	sendAddRating,
	sendUpdateRating,
} from '../functions/api';
import {Institution} from '../models/credit';
import rawStrings from '../raw-strings';
import {
	CourseRatingExpanded,
	FetchRatingAction,
	FetchRatingMore,
	fetchRatingMore,
	MyRating,
	RatingCore,
	RatingRequest,
	RatingSortOption,
	ReceiveRatingAction,
	ReceiveRatingMore,
	VotesDictionary,
	Voting,
} from '../types/ratings';

export const FETCH_MY_RATINGS = 'FETCH_MY_RATINGS';
export const RECEIVE_MY_RATINGS = 'RECEIVE_MY_RATINGS';
export const ERROR_RECEIVING_MY_RATINGS = 'ERROR_RECEIVING_MY_RATINGS';

export const ADD_RATING_REQUEST = 'ADD_RATING_REQUEST';
export const RATING_ADDED = 'RATING_ADDED';
export const ERROR_ADDING_RATING = 'ERROR_ADDING_RATING';

export const STARS_UPDATED = 'STARS_UPDATED';

export const UPDATE_RATING_REQUEST = 'UPDATE_RATING_REQUEST';
export const ERROR_UPDATING_RATING = 'ERROR_UPDATING_RATING';
export const RATING_UPDATED = 'RATING_UPDATED';

export const DELETING_RATING = 'DELETING_RATING';
export const RATING_DELETED = 'RATING_DELETED';
export const ERROR_DELETING_RATING = 'ERROR_DELETING_RATING';

export const VOTE_ADDED = 'VOTE_ADDED';

export type ReceiveMyRatingsAction = {
	type: 'RECEIVE_MY_RATINGS';
	ratings: MyRating[];
	institution: Institution;
	votes: VotesDictionary;
};

const receiveMyRatings = (
	ratings: MyRating[],
	institution: Institution,
	votes: VotesDictionary
): ReceiveMyRatingsAction => ({
	type: 'RECEIVE_MY_RATINGS',
	ratings,
	institution,
	votes,
});

export type ErrorReceivingMyRatings = {
	type: 'ERROR_RECEIVING_MY_RATINGS';
	institution: Institution;
	err: Error;
};

const errorReceivingMyRatings = (
	institution: Institution,
	err: Error
): ErrorReceivingMyRatings => ({
	type: 'ERROR_RECEIVING_MY_RATINGS',
	institution,
	err,
});

export type FetchMyRatingsAction = {
	type: 'FETCH_MY_RATINGS';
	institution: Institution;
};

const fetchMyRatings = (institution: Institution): FetchMyRatingsAction => ({
	type: 'FETCH_MY_RATINGS',
	institution,
});

export const fetchRatings = (token: string, institution: Institution) => {
	return async (dispatch: {
		(arg0: {type: string; institution: Institution}): void;
		(arg0: ReceiveMyRatingsAction): void;
		(arg0: {type: string; institution: Institution; err: any}): void;
	}) => {
		dispatch(fetchMyRatings(institution));
		try {
			const {ratings, votes} = await getMyRatings(token);
			const votesObject: {[_id: string]: Voting} = {};
			for (const vote of votes) {
				votesObject[vote._id] = vote.vote;
			}

			dispatch(receiveMyRatings(ratings, institution, votesObject));
		} catch (err) {
			dispatch(errorReceivingMyRatings(institution, err));
		}
	};
};

const fetchRating = (
	institution: Institution,
	uni_identifier: string,
	sortOption: RatingSortOption
): FetchRatingAction => ({
	type: 'FETCH_RATING',
	institution,
	uni_identifier,
	sortOption,
});

const receiveRatingAction = (
	institution: Institution,
	uni_identifier: string,
	data: CourseRatingExpanded,
	sortOption: RatingSortOption
): ReceiveRatingAction => ({
	type: 'RECEIVE_RATING',
	institution,
	uni_identifier,
	data,
	sortOption,
});

export type ErrorReceivingRatings = {
	type: 'ERROR_RECEIVING_RATING';
	institution: Institution;
	uni_identifier: string;
	err: Error;
	sortOption: RatingSortOption;
};

const errorReceivingRatings = (
	institution: Institution,
	uni_identifier: string,
	err: Error,
	sortOption: RatingSortOption
): ErrorReceivingRatings => ({
	type: 'ERROR_RECEIVING_RATING',
	institution,
	uni_identifier,
	err,
	sortOption,
});

export const getRating = ({
	institution,
	uni_identifier,
	sortOption,
	offset = 0,
	token,
	email,
}: {
	institution: Institution;
	uni_identifier: string;
	sortOption: RatingSortOption;
	token: string | null;
	offset?: number;
	email?: string;
}) => {
	return async (dispatch: {
		(arg0: FetchRatingAction): void;
		(arg0: ReceiveRatingAction): void;
		(arg0: ErrorReceivingRatings): void;
	}) => {
		try {
			dispatch(fetchRating(institution, uni_identifier, sortOption));
			const {data} = await getRatings({
				institution,
				uni_identifier,
				offset,
				sortOption,
				token,
				email,
			});
			dispatch(
				receiveRatingAction(institution, uni_identifier, data, sortOption)
			);
		} catch (err) {
			dispatch(
				errorReceivingRatings(institution, uni_identifier, err, sortOption)
			);
			console.log(err);
		}
	};
};

const receiveRatingMore = (
	institution: Institution,
	uni_identifier: string,
	data: CourseRatingExpanded,
	sortOption: RatingSortOption
): ReceiveRatingMore => ({
	type: 'RECEIVE_RATING_MORE',
	institution,
	uni_identifier,
	data,
	sortOption,
});

export const getMoreRating = ({
	institution,
	uni_identifier,
	offset,
	sortOption,
	token,
	email,
}: {
	institution: Institution;
	uni_identifier: string;
	offset: number;
	sortOption: RatingSortOption;
	token: string | null;
	email: string | undefined;
}) => {
	return async (dispatch: {
		(arg0: FetchRatingMore): void;
		(arg0: {
			type: string;
			institution: Institution;
			uni_identifier: string;
		}): void;
		(arg0: ReceiveRatingMore): void;
		(arg0: ErrorReceivingRatings): void;
	}) => {
		try {
			dispatch(fetchRatingMore(institution, uni_identifier, sortOption));
			const {data} = await getRatings({
				institution,
				uni_identifier,
				offset,
				sortOption,
				token,
				email,
			});
			dispatch(
				receiveRatingMore(institution, uni_identifier, data, sortOption)
			);
		} catch (err) {
			dispatch(
				errorReceivingRatings(institution, uni_identifier, err, sortOption)
			);
			console.log(err);
		}
	};
};

export type AddRatingRequest = {
	type: 'ADD_RATING_REQUEST';
};

const addRatingRequest = (): AddRatingRequest => ({
	type: 'ADD_RATING_REQUEST',
});

export type RatingAdded = {
	type: 'RATING_ADDED';
	institution: Institution;
	rating: RatingCore;
};

const ratingAdded = (institution: Institution, rating: RatingCore): RatingAdded => ({
	type: 'RATING_ADDED',
	institution,
	rating,
});

export type ErrorAddingRating = {
	type: 'ERROR_ADDING_RATING';
	err: string;
};

const errorAddingRating = (err: Error): ErrorAddingRating => ({
	type: 'ERROR_ADDING_RATING',
	err: err.message,
});

export const addRating = (
	r: RatingRequest,
	institution: Institution,
	callback: (id: string) => void
) => {
	return async (dispatch: {
		(arg0: AddRatingRequest): void;
		(arg0: RatingAdded): void;
		(arg0: ErrorAddingRating): void;
	}) => {
		try {
			dispatch(addRatingRequest());
			const {rating} = await sendAddRating({
				...r,
				name: r.name || null,
			});
			dispatch(
				ratingAdded(institution, {
					...rating,
					ups: 0,
					downs: 0,
				})
			);
			callback(rating._id);
		} catch (err) {
			dispatch(errorAddingRating(err));
		}
	};
};

export type VoteAdded = {
	type: 'VOTE_ADDED';
	_id: string;
	vote: Voting;
	token: string;
	previousVote: Voting;
	institution: Institution;
	skipRequest: boolean;
};

export const voteAdded = (
	_id: string,
	vote: Voting,
	token: string,
	previousVote: Voting,
	institution: Institution,
	skipRequest: boolean
): VoteAdded => ({
	type: 'VOTE_ADDED',
	_id,
	vote,
	token,
	previousVote,
	institution,
	skipRequest,
});

export const setVote = ({
	_id,
	vote,
	previousVote,
	token,
	institution,
}: {
	_id: string;
	vote: Voting;
	token: string;
	previousVote: Voting;
	institution: Institution;
}) => {
	return (dispatch: (arg0: VoteAdded) => void) => {
		try {
			dispatch(voteAdded(_id, vote, token, previousVote, institution, false));
		} catch (err) {
			console.log(err);
		}
	};
};

export type StarsUpdated = {
	type: 'STARS_UPDATED';
	score: number;
	oldScore: number;
	rating: RatingRequest;
};

const starsUpdated = (
	rating: RatingRequest,
	oldScore: number,
	score: number
): StarsUpdated => ({
	type: 'STARS_UPDATED',
	score,
	oldScore,
	rating,
});

export const updateStars = ({
	rating,
	_id,
	score,
	token,
	oldScore,
}: {
	rating: RatingRequest;
	_id: string;
	score: number;
	token: string;
	oldScore: number;
}) => {
	return async (dispatch: {
		(arg0: AddRatingRequest): void;
		(arg0: StarsUpdated): void;
		(arg0: ErrorAddingRating): void;
	}) => {
		try {
			dispatch(addRatingRequest());
			await sendUpdateRating(_id, {
				score,
				token,
			});
			dispatch(starsUpdated(rating, oldScore, score));
		} catch (err) {
			dispatch(errorAddingRating(err));
		}
	};
};

export type UpdateRatingRequest = {
	type: 'UPDATE_RATING_REQUEST';
	_id: string;
};

const updateRatingRequest = (_id: string): UpdateRatingRequest => ({
	type: 'UPDATE_RATING_REQUEST',
	_id,
});

export type RatingUpdated = {
	type: 'RATING_UPDATED';
	_id: string;
	rating: RatingRequest;
};

const ratingUpdated = (_id: string, rating: RatingRequest): RatingUpdated => ({
	type: 'RATING_UPDATED',
	_id,
	rating,
});

export type ErrorUpdatingRating = {
	type: 'ERROR_UPDATING_RATING';
	_id: string;
};

const errorUpdatingRating = (_id: string): ErrorUpdatingRating => ({
	type: 'ERROR_UPDATING_RATING',
	_id,
});

export const updateRating = (
	_id: string,
	rating: RatingRequest,
	callback: () => void
) => {
	return async (dispatch: {
		(arg0: UpdateRatingRequest): void;
		(arg0: {type: string; _id: string; rating: RatingCore}): void;
		(arg0: {type: string; _id: string}): void;
	}) => {
		try {
			dispatch(updateRatingRequest(_id));
			await sendUpdateRating(_id, rating);
			dispatch(ratingUpdated(_id, rating));
			callback();
		} catch (err) {
			dispatch(errorUpdatingRating(_id));
			Alert.alert(rawStrings.ERROR.de, err.message, [
				{text: rawStrings.OK.de},
			]);
		}
	};
};
