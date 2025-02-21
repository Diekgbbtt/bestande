import React from 'react';
import {RatingSortOption} from '../../../core/types/ratings';
import {Radio} from './forms/radio';
import {RadioLabel} from './radio-buttons';

export const RatingSortPicker = ({
	sortOption,
	setSortOption,
}: {
	sortOption: RatingSortOption;
	setSortOption: (option: RatingSortOption) => void;
}) => {
	return (
		<div>
			<RadioLabel
				onClick={() => {
					setSortOption('best');
				}}
				checked={sortOption === 'best'}
			>
				<Radio invert name="radio" checked={sortOption === 'best'} />
				Beste
			</RadioLabel>
			<RadioLabel
				onClick={() => {
					setSortOption('top');
				}}
				checked={sortOption === 'top'}
			>
				<Radio invert name="radio" checked={sortOption === 'top'} />
				Top
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
