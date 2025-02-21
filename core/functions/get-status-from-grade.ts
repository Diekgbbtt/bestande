import {CreditStatus, UntypedGrade} from '../models/credit';

export const getStatusFromGrade = (grade: UntypedGrade): CreditStatus => {
	if (grade === null || grade === undefined) {
		return 'ADDED';
	}

	if (grade === 'BEST' || (typeof grade === 'number' && grade >= 4)) {
		return 'PASSED';
	}

	return 'FAILED';
};
