import isNumber from 'lodash/isNumber';
import {Credit} from '../models/credit';

export const canCountTowardsAverage = (credit: Credit) => {
	if (
		credit.status === 'BOOKED' ||
		credit.status === 'DESELECTED' ||
		credit.status === 'CONTINUE' ||
		credit.status === 'ADDED'
	) {
		return false;
	}

	if (!credit.credits_received) {
		return false;
	}

	const grade =
		credit.grade === null ? null : parseInt(String(credit.grade), 10);
	if (isNumber(grade) && grade >= 1 && grade <= 6) {
		return true;
	}

	if (
		credit.grade === 'BEST' ||
		credit.grade === 'Best' ||
		credit.grade === 'N. BE' ||
		credit.grade === 'N.BE' ||
		credit.grade === 'NB' ||
		credit.grade === 'Abbr'
	) {
		return false;
	}

	return false;
};
