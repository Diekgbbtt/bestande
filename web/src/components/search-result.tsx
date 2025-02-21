import sortBy from 'lodash/sortBy';
import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import Stars from '../../../core/components/stars-web';
import {getNewestSemesterFromSearchResult} from '../../../core/functions/get-newest-semester-from-search-result';
import {getSearchResultLink} from '../../../core/functions/get-search-result-link';
import renderModuleType from '../../../core/functions/render-module-type';
import {truthy} from '../../../core/functions/truthy';
import {useIsomorphicState} from '../../../core/functions/use-app-state';
import Module, {ModulePreview} from '../../../core/models/module';
import {AlgoliaCreditResult} from '../../../core/types/algolia-range';
import {renderRating} from './module-content';
import {Highlight} from 'react-instantsearch';

const SearchResultWrapper = styled(Link)`
	cursor: pointer;
	display: block;
	padding-bottom: 8px;
	padding-top: 8px;
	color: inherit;
`;

const Title = styled.div`
	font-weight: bold;
	em {
		font-style: normal;
		background: rgba(0, 0, 255, 0.1);
	}
`;

const Subtitle = styled.div`
	color: gray;
	font-size: 0.9em;
	display: flex;
	flex-direction: row;
	align-items: center;
`;

const StarsContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
`;

const StarsCount = styled.div`
	color: gray;
	margin-left: 5px;
	margin-top: 2px;
	display: inline-block;
`;

const renderDepartment = (departments) => {
	if (!departments) {
		return null;
	}

	if (departments.length < 3) {
		return departments.join(', ');
	}

	return departments[0] + ', ' + departments[1] + ', ...';
};

export const getGermanName = (result: Module): string => {
	if (result.translatedNames) {
		const germanName = result.translatedNames.find(
			(name) => name.language === 'de'
		)?.value;
		if (germanName) {
			return germanName;
		}
	}
	return result.name || '';
};

const SearchResult = ({hit}) => {
	const language = useIsomorphicState((state) => state.language.selectedLanguage);
	const highlightedHit = {
		...hit,
		_highlightResult: {
			highlightName:
				hit._highlightResult.translatedNames &&
				hit._highlightResult.translatedNames[0].value
					? hit._highlightResult.translatedNames[0].value
					: hit._highlightResult.name.value,
		},
	};
	return (
		<div>
			<SearchResultWrapper to={getSearchResultLink(hit)}>
				<Title title={highlightedHit.name}>
					<Highlight attribute="highlightName" hit={highlightedHit} />
				</Title>
				<Subtitle>
					{[
						Object.prototype.hasOwnProperty.call(hit, 'semester')
							? getNewestSemesterFromSearchResult(
									hit as AlgoliaCreditResult
							  )
							: null,
						Object.prototype.hasOwnProperty.call(hit, 'semesters')
							? sortBy(
									(hit as ModulePreview).semesters,
									(s) => 0 - s.period
							  )[0].period_human
							: null,
						hit.faculty !== 'Mathematik-Naturwissenschaft'
							? hit.faculty
							: 'MNF',
						Object.prototype.hasOwnProperty.call(hit, 'departments')
							? renderDepartment(
									(hit as AlgoliaCreditResult).departments
							  )
							: null,
						' ',
					]
						.filter(truthy)
						.join(' • ')}

					{hit.ratingSummary?.average ? (
						<StarsContainer style={{marginLeft: '5px'}}>
							<Stars
								stars={hit.ratingSummary.average}
								half
								size={16}
							/>
							<StarsCount>({hit.ratingSummary.total})</StarsCount>
						</StarsContainer>
					) : null}
				</Subtitle>
				<Subtitle>
					{[
						renderModuleType((hit as ModulePreview).type, language),
						parseFloat(
							Object.prototype.hasOwnProperty.call(hit, 'semesters')
								? String((hit as ModulePreview).semesters[0].credits)
								: String((hit as AlgoliaCreditResult).credits)
						) + ' ECTS',
					]
						.filter(truthy)
						.join(' • ')}
				</Subtitle>
			</SearchResultWrapper>
		</div>
	);
};

export default SearchResult;
