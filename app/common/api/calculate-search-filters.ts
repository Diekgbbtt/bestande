import {truthy} from '../../../core/functions/truthy';
import {Institution} from '../../../core/models/credit';
import {CreditFacet} from '../components/SearchCreditsFilter';
import {SearchFacet} from '../components/SearchDepartmentFacet';
import {PassRateFacet} from '../components/SearchPassRateFilters';
import {RatingFacet} from '../components/SearchRatings';

const mapCreditsFacetToFilter = (facet: CreditFacet): string => {
	switch (facet) {
		case '0-1-ects':
			return `credits: 0 to 1`;
		case '2-3-ects':
			return `credits: 2 to 3`;
		case '4-6-ects':
			return `credits: 4 to 6`;
		case '7-9-ects':
			return `credits: 7 to 9`;
		case '10plus-ects':
			return `credits>=10`;
		default:
			throw new Error('invalid credit facet');
	}
};

const mapRatingsFacetToFilter = (facet: RatingFacet): string => {
	switch (facet) {
		case '2.5-plus':
			return `ratingSummary.average>=2.5`;
		case '3.5-plus':
			return `ratingSummary.average>=3.5`;
		case '4.5-plus':
			return `ratingSummary.average>=4.5`;
		default:
			throw new Error('invalid credit facet');
	}
};

const mapPassRateFacet = (facet: PassRateFacet): string => {
	switch (facet) {
		case '75-plus':
			return `passRate>=75`;
		case '85-plus':
			return `passRate>=85`;
		case '95-plus':
			return `passRate>=95`;
		default:
			throw new Error('invalid credit facet');
	}
};

export const calculateSearchFilters = ({
	institution,
}: {
	institution: Institution;
}) => {
	return [`university:${institution}`].filter(truthy).join(' AND ');
};

export const calculateSearchNumericFilters = ({
	facets,
}: {
	facets: SearchFacet[];
}) => {
	const creditsFacet = facets.find((facet) => facet.type === 'credits');
	const ratingsFacet = facets.find((facet) => facet.type === 'ratings');
	const passRateFacet = facets.find((facet) => facet.type === 'passrate');

	return [
		creditsFacet
			? mapCreditsFacetToFilter(creditsFacet.name as CreditFacet)
			: null,
		ratingsFacet
			? mapRatingsFacetToFilter(ratingsFacet.name as RatingFacet)
			: null,
		passRateFacet
			? mapPassRateFacet(passRateFacet.name as PassRateFacet)
			: null,
	]
		.filter(truthy)
		.join(' AND ');
};
