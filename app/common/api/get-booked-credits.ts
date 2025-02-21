import {createSelector} from 'reselect';
import {getVisibleCredits} from '../../../core/functions/Credits';
import {isCreditBooked} from './is-credit-booked';

export const getBookedCredits = createSelector([getVisibleCredits], (credits) =>
	credits.filter((c) => isCreditBooked(c))
);
