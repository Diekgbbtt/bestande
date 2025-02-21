import sortBy from 'lodash/sortBy';
import {AlgoliaCreditResult} from '../types/algolia-range';
import {immutableReverse} from './immutable-reverse';
import {humanToPeriod} from './uzh-period';

export const getNewestSemesterFromSearchResult = (
	result: AlgoliaCreditResult
): string | null => {
	if (!result.semester || !result.semester.length) {
		return null;
	}

	return immutableReverse(sortBy(result.semester, (s) => humanToPeriod(s)))[0];
};
