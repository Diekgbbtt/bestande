import {periodToUzhFormat} from '../../../core/functions/uzh-period';
import {UZH} from '../../../core/models/university';
import {ApiResponse} from '../../../core/reducers/api';

export const getVvzLink = (
	credit: ApiResponse,
	period: number
): string | null => {
	if (credit.university === UZH) {
		const {semester, year} = periodToUzhFormat(period);
		return `https://studentservices.uzh.ch/uzh/anonym/vvz/index.html#/details/${year}/${semester}/SM/${credit.uni_identifier}`;
	}

	return null;
};
