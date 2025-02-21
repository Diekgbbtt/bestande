import memoize from 'lodash/memoize';
import {getNewestSemesterFromSearchResult} from '../../../core/functions/get-newest-semester-from-search-result';
import {periodToString} from '../../../core/functions/uzh-period';
import {PeriodHuman} from '../../../core/models/credit';
import {ApiResponse} from '../../../core/reducers/api';
import {AlgoliaCreditResult} from '../../../core/types/algolia-range';

export const getSemesterFromResult = memoize(
	(result: AlgoliaCreditResult | Partial<ApiResponse>): PeriodHuman => {
		if ('semesters' in result && result.semesters?.length) {
			return periodToString(result.semesters[0].period);
		}

		return getNewestSemesterFromSearchResult(
			result as AlgoliaCreditResult
		) as PeriodHuman;
	}
);
