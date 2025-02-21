import isNumber from 'lodash/isNumber';
import {Credit} from '../models/credit';
import {CountsTowardsCreditsState} from '../reducers/countsTowardsCredits';
import {CountsTowardsAverageState} from '../types/counts-towards-average-state';
import {canCountTowardsAverage} from './can-count-towards-average';
import {
	doesCountTowardsCredit,
	shouldCountTowardsCredit,
} from './does-count-towards-credit';
import {getUniqueIdentifier} from './get-unique-identifier';

export const shouldCountTowardsAverage = (credit: Credit): boolean => {
	if (!canCountTowardsAverage(credit)) {
		return false;
	}

	if (credit.status === 'FAILED') {
		return false;
	}

	const grade =
		credit.grade === null ? null : parseInt(String(credit.grade), 10);
	if (isNumber(grade) && grade >= 1 && grade <= 6) {
		return true;
	}

	return false;
};

export const doesCountTowardsAverage = (
	countsTowardsCredits: CountsTowardsCreditsState,
	countsTowardsAverage: CountsTowardsAverageState,
	credit: Credit
): boolean => {
	if (!canCountTowardsAverage(credit)) {
		return false;
	}

	if (!doesCountTowardsCredit(countsTowardsCredits, credit)) {
		return false;
	}

	const doesCount = countsTowardsAverage[getUniqueIdentifier(credit, true)];
	if (typeof doesCount === 'boolean') {
		return doesCount;
	}

	return shouldCountTowardsCredit(credit);
};
