import React from 'react';
import {RadioLabel} from './radio-buttons';
import {Radio} from './forms/radio';
import {FileSortOption} from '../../../core/types/types';

export const DocumentSortPicker = ({
	sortOption,
	setSortOption,
}: {
	sortOption: FileSortOption;
	setSortOption: (option: FileSortOption) => void;
}) => {
	return (
		<div>
			<RadioLabel
				onClick={() => {
					setSortOption('most_downloaded');
				}}
				checked={sortOption === 'most_downloaded'}
			>
				<Radio
					invert
					name="radio"
					checked={sortOption === 'most_downloaded'}
				/>
				Meiste Downloads
			</RadioLabel>
			<RadioLabel
				onClick={() => {
					setSortOption('biggest');
				}}
				checked={sortOption === 'biggest'}
			>
				<Radio invert name="radio" checked={sortOption === 'biggest'} />
				Grösste
			</RadioLabel>
			<RadioLabel
				onClick={() => {
					setSortOption('smallest');
				}}
				checked={sortOption === 'smallest'}
			>
				<Radio invert name="radio" checked={sortOption === 'smallest'} />
				Kleinste
			</RadioLabel>
			<RadioLabel
				onClick={() => {
					setSortOption('newest');
				}}
				checked={sortOption === 'newest'}
			>
				<Radio invert name="radio" checked={sortOption === 'newest'} />
				Neueste
			</RadioLabel>
			<RadioLabel
				onClick={() => {
					setSortOption('oldest');
				}}
				checked={sortOption === 'oldest'}
			>
				<Radio invert name="radio" checked={sortOption === 'oldest'} />
				Älteste
			</RadioLabel>
		</div>
	);
};

