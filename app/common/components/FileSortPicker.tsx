import React, {useMemo} from 'react';
import {FileSortOption} from '../../../core/types/types';
import {SortOption, SortPicker} from './SortPicker';

export const FileSortPicker: React.FC<{
	current: FileSortOption;
	setSort: (option: FileSortOption) => void;
}> = ({current, setSort}) => {
	const availableOptions = useMemo(
		(): SortOption<FileSortOption>[] => [
			{
				key: 'newest',
				str: 'SORT_NEWEST',
			},
			{
				key: 'oldest',
				str: 'SORT_OLDEST',
			},
			{
				key: 'most_downloaded',
				str: 'SORT_MOST_DOWNLOADED',
			},
			{
				key: 'biggest',
				str: 'SORT_BIGGEST',
			},
			{
				key: 'smallest',
				str: 'SORT_SMALLEST',
			},
		],
		[]
	);

	return (
		<SortPicker<FileSortOption> {...{setSort, availableOptions, current}} />
	);
};
