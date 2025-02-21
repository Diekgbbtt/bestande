import memoize from 'lodash/memoize';
import {UntypedGrade} from '../../../core/models/credit';

export const formatGrade = memoize((grade: UntypedGrade): string => {
	if (grade === null || grade === '') {
		return '';
	}

	const asANumber = Number(grade);
	if (isNaN(asANumber)) {
		return String(grade);
	}

	return asANumber.toFixed(2);
});
