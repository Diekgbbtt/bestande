import {Institution} from '../models/credit';
import {ETH, UZH} from '../models/university';

const isPeriodValid = (institution: Institution, period: number | string) => {
	if (institution !== UZH && institution !== ETH) {
		return false;
	}

	const p = parseInt(String(period), 10);
	return (p % 10 === 2 || p % 10 === 1) && p > 20130 && p < 20303;
};

export const previousPeriod = (period: number) => {
	if (period % 2 === 1) {
		return period - 9;
	}

	return period - 1;
};

export const nextPeriod = (period: number) => {
	if (period % 2 === 1) {
		return period + 1;
	}

	return period + 9;
};

export default isPeriodValid;
