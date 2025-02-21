import memoize from 'lodash/memoize';
import {Credit} from '../../../core/models/credit';

export const isCreditBooked = memoize((credit: Credit): boolean => {
	return credit.status === 'BOOKED' || credit.status === 'ADDED';
});
