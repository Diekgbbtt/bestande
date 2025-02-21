import memoize from 'lodash/memoize';
import {PeriodHuman} from '../models/credit';

export const periodToNumber = (year: string | number, semester: string) => {
	if (semester === '003') {
		return parseInt(year + '2', 10);
	}

	if (semester === '004') {
		return parseInt(parseInt(String(year), 10) + 1 + '1', 10);
	}

	throw new Error('Invalid year');
};

export const periodToString = memoize(
	(period: number | string | null): PeriodHuman => {
		const str = String(period);
		const year = str.substr(2, 2);
		const semesterMap = {
			1: 'FS',
			2: 'HS',
		};
		const lastPart = parseInt(str.substr(4, 5), 10);
		const semester =
			lastPart === 1 || lastPart === 2 ? semesterMap[lastPart] : '';
		return `${semester}${year}` as PeriodHuman;
	}
);

export const humanToPeriod = memoize((period: string | null): number | null => {
	if (!period) {
		return null;
	}

	const semester = period.substr(0, 2);
	const semesterStr = semester === 'HS' ? '003' : '004';
	const year = parseInt(period.substr(2, 4), 10);
	const yearStr = semesterStr === '003' ? year : year - 1;
	return periodToNumber(2000 + yearStr, semesterStr);
});

export const periodToUzhFormat = memoize((period: number) => {
	const semester = period % 2 === 1 ? '004' : '003';
	const year = Math.floor(period / 10);
	return {
		semester,
		year: semester === '004' ? year - 1 : year,
	};
});
