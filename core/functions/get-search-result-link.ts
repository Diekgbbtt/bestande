import Module, {ModulePreview} from '../models/module';
import {AlgoliaCreditResult} from '../types/algolia-range';
import {mapToUniSlug} from './uni-slug';

export const getSearchResultLink = (
	result: ModulePreview | AlgoliaCreditResult | Module
) => {
	return (
		'/' +
		mapToUniSlug(result.university) +
		'/' +
		(Object.prototype.hasOwnProperty.call(result, 'slug') &&
		(result as AlgoliaCreditResult).slug.length
			? (result as AlgoliaCreditResult).slug[0]
			: result.uni_identifier)
	);
};
