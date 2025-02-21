import React from 'react';
import {renderSemester} from '../../../core/functions/render-semester';
import {AppLanguage} from '../../../core/models/app-language';
import {Institution} from '../../../core/models/credit';
import {ETH, UZH} from '../../../core/models/university';
import rawStrings from '../../../core/raw-strings';
import {CreditFacet} from './SearchCreditsFilter';
import {SearchFacet, SearchLightLabel} from './SearchDepartmentFacet';
import {PassRateFacet} from './SearchPassRateFilters';
import {RatingFacet} from './SearchRatings';
import {SortOption} from './SearchSortFilter';

const getSearchFacultyFilterShorthand = ({
	facets,
	institution,
}: {
	facets: SearchFacet[];
	institution: Institution;
}) => {
	const faculties = facets.filter((facet) => facet.type === 'faculty');
	const departments = facets.filter((facet) => facet.type === 'departments');
	if (institution === UZH && faculties.length > 0) {
		return faculties.map((f) => f.name).join(', ');
	}

	if (institution === ETH && departments.length > 0) {
		return departments.map((f) => f.name).join(', ');
	}

	return null;
};

export const getSearchFacultyFilterLabel = ({
	facets,
	institution,
	language,
	active,
}: {
	facets: SearchFacet[];
	institution: Institution;
	language: AppLanguage;
	active: boolean;
}) => {
	const label = getSearchFacultyFilterShorthand({
		facets,
		institution,
	});

	return (
		<>
			{institution === ETH
				? rawStrings.DEPARTMENT[language]
				: rawStrings.FACULTY[language]}
			{label ? (
				<SearchLightLabel active={active}>{`: ${label}`}</SearchLightLabel>
			) : null}
		</>
	);
};

const getSearchSemesterShorthand = ({
	facets,
	language,
}: {
	facets: SearchFacet[];
	language: AppLanguage;
}) => {
	const semesters = facets.filter((facet) => facet.type === 'semester');
	if (semesters.length > 0) {
		return semesters.map((f) => renderSemester(f.name, language)).join(', ');
	}

	return null;
};

export const getSearchSemesterLabel = ({
	facets,
	language,
	active,
}: {
	facets: SearchFacet[];
	language: AppLanguage;
	active: boolean;
}) => {
	const shorthand = getSearchSemesterShorthand({facets, language});
	return (
		<>
			{rawStrings.SEMESTER[language]}
			{shorthand ? (
				<SearchLightLabel active={active}>{`: ${shorthand}`}</SearchLightLabel>
			) : null}
		</>
	);
};

export const renderCreditsFacet = (creditFacet: CreditFacet) => {
	switch (creditFacet) {
		case '0-1-ects':
			return '0-1 ECTS';
		case '2-3-ects':
			return '2-3 ECTS';
		case '4-6-ects':
			return '4-6 ECTS';
		case '7-9-ects':
			return '7-9 ECTS';
		case '10plus-ects':
			return '10+ ECTS';
		default:
			throw new Error('unknown label for credits');
	}
};

export const renderRatingsFacet = (ratingFacet: RatingFacet) => {
	switch (ratingFacet) {
		case '2.5-plus':
			return '2.5★+';
		case '3.5-plus':
			return '3.5★+';
		case '4.5-plus':
			return '4.5★+';
		default:
			throw new Error('unknown label for credits');
	}
};

const getCreditShortHand = ({facets}: {facets: SearchFacet[]}) => {
	const credits = facets.find((facet) => facet.type === 'credits');
	if (credits) {
		return renderCreditsFacet(credits.name as CreditFacet);
	}

	return null;
};

export const getCreditsLabel = ({
	facets,
	language,
	active,
}: {
	facets: SearchFacet[];
	language: AppLanguage;
	active: boolean;
}) => {
	const label = getCreditShortHand({facets});

	return (
		<>
			{rawStrings.CREDITS[language]}
			{label ? (
				<SearchLightLabel active={active}>{`: ${label}`}</SearchLightLabel>
			) : null}
		</>
	);
};

const getRatingsShorthand = ({facets}: {facets: SearchFacet[]}) => {
	const ratings = facets.filter((facet) => facet.type === 'ratings');
	if (ratings.length > 0) {
		return ratings
			.map((f) => renderRatingsFacet(f.name as RatingFacet))
			.join(', ');
	}

	return null;
};

export const getRatingsLabel = ({
	facets,
	language,
	active,
}: {
	facets: SearchFacet[];
	language: AppLanguage;
	active: boolean;
}) => {
	const shorthand = getRatingsShorthand({facets});
	return (
		<>
			{rawStrings.RATING[language]}
			{shorthand ? (
				<SearchLightLabel active={active}>{`: ${shorthand}`}</SearchLightLabel>
			) : null}
		</>
	);
};

export const renderPassRateFacet = (passrate: PassRateFacet) => {
	switch (passrate) {
		case '75-plus':
			return '75%+';
		case '85-plus':
			return '85%+';
		case '95-plus':
			return '95%+';
		default:
			throw new Error('unknown pass rate facet');
	}
};

export const renderSortFacet = (sort: SortOption, language: AppLanguage) => {
	switch (sort) {
		case 'relevance':
			return rawStrings.SORT_MOST_RELEVANCE[language];
		case 'rating':
			return rawStrings.SORT_BEST_RATING[language];
		case 'user-count':
			return rawStrings.SORT_MOST_USERS[language];
		case 'passrate':
			return rawStrings.SORT_BEST_PASSRATE[language];
		case 'credits':
			return rawStrings.SORT_MOST_CREDITS[language];
		default:
			throw new Error('unknown sort facet');
	}
};

const getPassRateShorthand = ({facets}: {facets: SearchFacet[]}) => {
	const passRate = facets.find((facet) => facet.type === 'passrate');
	if (passRate) {
		return renderPassRateFacet(passRate.name as PassRateFacet);
	}

	return null;
};

export const getPassRateLabel = ({
	facets,
	language,
	active,
}: {
	facets: SearchFacet[];
	language: AppLanguage;
	active: boolean;
}) => {
	const shorthand = getPassRateShorthand({facets});

	return (
		<>
			{rawStrings.PASS_RATE[language]}
			{shorthand ? (
				<SearchLightLabel active={active}>{`: ${shorthand}`}</SearchLightLabel>
			) : null}
		</>
	);
};

export const getSortLabel = ({
	active,
	language,
	sortOption,
}: {
	language: AppLanguage;
	active: boolean;
	sortOption: SortOption;
}) => {
	return (
		<>
			{rawStrings.SORTED[language]}:{' '}
			<SearchLightLabel active={active}>
				{renderSortFacet(sortOption, language)}
			</SearchLightLabel>
		</>
	);
};
