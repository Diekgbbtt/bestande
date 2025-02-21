import {Credit} from '../models/credit';
import {CountsTowardsCreditsState} from '../reducers/countsTowardsCredits';
import {getUniqueIdentifier} from './get-unique-identifier';

export const shouldCountTowardsCredit = (module: Credit) => {
	return module.status === 'PASSED';
};

export const canCountTowardsCredits = (module: Credit) => {
	if (
		module.status === 'BOOKED' ||
		module.status === 'DESELECTED' ||
		module.status === 'ADDED' ||
		module.status === 'CONTINUE'
	) {
		return false;
	}

	if (!module.credits_received) {
		return false;
	}

	return true;
};

export const doesCountTowardsCredit = (
	countsTowardsCredits: CountsTowardsCreditsState,
	credit: Credit
): boolean => {
	if (!canCountTowardsCredits(credit)) {
		return false;
	}

	const doesCount = countsTowardsCredits[getUniqueIdentifier(credit, true)];
	if (typeof doesCount === 'boolean') {
		return doesCount;
	}

	return shouldCountTowardsCredit(credit);
};
