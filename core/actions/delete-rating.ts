import {Institution} from '../models/credit';
import {RatingCore} from '../types/ratings';

export type DeletingRatingAction = {
	type: 'DELETING_RATING';
	_id: string;
};

export const deletingRating = (_id: string): DeletingRatingAction => ({
	type: 'DELETING_RATING',
	_id,
});

export type RatingDeleted = {
	type: 'RATING_DELETED';
	_id: string;
	rating: RatingCore;
	institution: Institution;
};

export const ratingDeleted = (
	_id: string,
	rating: RatingCore,
	institution: Institution
): RatingDeleted => ({
	type: 'RATING_DELETED',
	_id,
	rating,
	institution,
});

export type ErrorDeletingRating = {
	type: 'ERROR_DELETING_RATING';
	_id: string;
	err: string;
};

export const errorDeletingRating = (
	_id: string,
	err: string
): ErrorDeletingRating => ({
	type: 'ERROR_DELETING_RATING',
	_id,
	err,
});
