import {Institution} from '../models/credit';

export type RatingSortOption = 'best' | 'newest' | 'top' | 'oldest';

export type RatingBaseCore = {
	score: number;
	review: string | null;
	uni_identifier: string;
	university: Institution;
	name?: string | null;
	username?: string | null;
	email?: string | null;
	censored?: boolean;
	deleting?: boolean;
	updating?: boolean;
	date?: number;
	token?: string;
	grade: string | null;
	direction: string | null;
	_id?: string | null;
};

export type User = {
	display_name: string;
	avatar?: string;
	team_member?: boolean;
	verified?: boolean;
	type?: 'facebook';
	email?: string;
};

export type WebUser = User & {
	_id?: string;
	emails: {
		value: string;
		verified: boolean;
	}[];
};

export type RatingRequest = RatingBaseCore & {
	token: string | null;
	user?: any;
};

export type CourseRating = CourseRatingBase & {
	ratings: string[];
};

export type RatingsState = {[key: string]: RatingCore};

export type RatingCore = RatingBaseCore & {
	_id: string;
	date: number;
	name: string | null;
	username?: string | null;
	email?: string | null;
	ups?: number;
	downs?: number;
	voteScore?: number;
	hasReview?: boolean;
	myVote?: VotingEnum | undefined;
};

type CourseRatingBase = {
	average: number | null;
	total: number;
	overview: {[key: number]: number};
	previousAverage: number | null;
	totalInTimespan: number;
};

export type CourseRatingExpanded = CourseRatingBase & {
	ratings: RatingCore[];
};

export type MyRating = {
	_id: string;
	uni_identifier: string;
	university: Institution;
};

export type Voting = 'up' | 'down' | 'neutral';

export enum VotingEnum {
	UP = 'up',
	DOWN = 'down',
	NEUTRAL = 'neutral',
}

export type VotesDictionary = {[key: string]: Voting};

export const FETCH_RATING = 'FETCH_RATING';
export const RECEIVE_RATING = 'RECEIVE_RATING';
export const ERROR_RECEIVING_RATING = 'ERROR_RECEIVING_RATING';
export const FETCH_RATING_MORE = 'FETCH_RATING_MORE';
export const RECEIVE_RATING_MORE = 'RECEIVE_RATING_MORE';

export type FetchRatingMore = {
	type: 'FETCH_RATING_MORE';
	institution: Institution;
	uni_identifier: string;
	sortOption: RatingSortOption;
};

export type FetchRatingAction = {
	type: 'FETCH_RATING';
	institution: Institution;
	uni_identifier: string;
	sortOption: RatingSortOption;
};

export type ReceiveRatingAction = {
	type: 'RECEIVE_RATING';
	institution: Institution;
	uni_identifier: string;
	data: CourseRatingExpanded;
	sortOption: RatingSortOption;
};

export const fetchRatingMore = (
	institution: Institution,
	uni_identifier: string,
	sortOption: RatingSortOption
): FetchRatingMore => ({
	type: 'FETCH_RATING_MORE',
	institution,
	uni_identifier,
	sortOption,
});

export type ReceiveRatingMore = {
	type: 'RECEIVE_RATING_MORE';
	institution: Institution;
	uni_identifier: string;
	data: CourseRatingExpanded;
	sortOption: RatingSortOption;
};

export type MyRatingsState = {
	loading: boolean;
	ratings: MyRating[];
	votes: VotesDictionary;
	error: Error | null;
};

export type RatingState = {
	[key: string]: RatingCore;
};
