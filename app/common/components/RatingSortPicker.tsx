import React, {useMemo} from 'react';
import {RatingSortOption} from '../../../core/types/ratings';
import {SortOption, SortPicker} from './SortPicker';

export const RatingSortPicker = ({
	sortOption,
	setSortOption,
}: {
	sortOption: RatingSortOption;
	setSortOption: (option: RatingSortOption) => void;
}) => {
	const availableOptions = useMemo(
		(): SortOption<RatingSortOption>[] => [
			{key: 'best' as const, str: 'SORT_BEST'},
			{key: 'top' as const, str: 'SORT_TOP'},
			{key: 'newest' as const, str: 'SORT_NEWEST'},
			{key: 'oldest' as const, str: 'SORT_OLDEST'},
		],
		[]
	);

	return (
		<SortPicker<RatingSortOption>
			availableOptions={availableOptions}
			current={sortOption}
			setSort={setSortOption}
		/>
	);
};
