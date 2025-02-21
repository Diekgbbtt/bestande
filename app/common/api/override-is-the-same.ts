import {CreditHelpers} from '../../../core/functions/CreditHelpers';
import {Credit} from '../../../core/models/credit';
import {Override} from '../../../core/reducers/creditOverrides';

export const overrideIsTheSame = (
	credit: Credit,
	override: Override
): boolean => {
	if (!override) {
		return true;
	}

	if (
		override.credits_received &&
		override.credits_received !== credit.credits_received
	) {
		return false;
	}

	if (override.grade && override.grade !== credit.grade) {
		return false;
	}

	if (override.period && override.period !== CreditHelpers.getPeriod(credit)) {
		return false;
	}

	if (override.status && override.status !== credit.status) {
		return false;
	}

	return true;
};
