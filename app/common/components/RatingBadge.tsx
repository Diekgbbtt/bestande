import React from 'react';
import {ApiResponse} from '../../../core/reducers/api';
import {SingleModuleRatingState} from '../../../core/types/module-ratings-state';
import {TabBadge, TabBadgeIcon, TabBadgeLabel} from './TabBadge';

export const RatingBadge = (props: {
	mod: ApiResponse;
	ratings: SingleModuleRatingState;
}) => {
	if (!props.mod) {
		return null;
	}

	if (!props.mod.ratingSummary) {
		return null;
	}

	if (!props.mod.ratingSummary.average) {
		return null;
	}

	const actualStars = props.ratings.data;
	const rating = actualStars
		? actualStars.average
		: props.mod.ratingSummary.average;
	if (!rating) {
		return null;
	}

	return (
		<TabBadge>
			<TabBadgeIcon source={require('../assets/star-full.png')} />
			<TabBadgeLabel>{Math.round(rating * 10) / 10}</TabBadgeLabel>
		</TabBadge>
	);
};
