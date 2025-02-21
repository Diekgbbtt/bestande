import sortBy from 'lodash/sortBy';
import {ApiResponse} from '../../../core/reducers/api';
import {AlgoliaCreditResult} from '../../../core/types/algolia-range';

export const getCreditsFromResult = (
	result: AlgoliaCreditResult | Partial<ApiResponse>
) => {
	return (
		parseFloat(
			String(
				'semesters' in result
					? (sortBy(result.semesters, (s) => 0 - s.period)[0].credits as number)
					: (result as AlgoliaCreditResult).credits
			)
		) || 0
	);
};
