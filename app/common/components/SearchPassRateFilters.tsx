import React, {useCallback} from 'react';
import {ScrollView} from 'react-native';
import {Spacer} from '../../../core/components/UI/Spacer';
import {renderPassRateFacet} from './search-labels';
import {SearchFacet, SearchFacetButton} from './SearchDepartmentFacet';
import {FacetContainer, FacetToolbar} from './SearchFacets';

const passRateFacets = ['75-plus', '85-plus', '95-plus'] as const;

export type PassRateFacet = typeof passRateFacets[number];

export const SearchPassRateFilters: React.FC<{
	queryFacets: SearchFacet[];
	setFacets: React.Dispatch<React.SetStateAction<SearchFacet[]>>;
}> = ({queryFacets, setFacets}) => {
	const toggleFacet = useCallback(
		(facet: PassRateFacet) => {
			setFacets((existingFacets) => {
				const index = existingFacets.findIndex((existing) => {
					return existing.type === 'passrate' && existing.name === facet;
				});
				if (index > -1) {
					return existingFacets.filter((existing, i) => i !== index);
				}

				const withoutAnyPassRateFacets = existingFacets.filter(
					(existing) => existing.type !== 'passrate'
				);

				return [...withoutAnyPassRateFacets, {name: facet, type: 'passrate'}];
			});
		},
		[setFacets]
	);

	return (
		<FacetContainer>
			<ScrollView horizontal showsHorizontalScrollIndicator={false}>
				<FacetToolbar>
					{passRateFacets.map((name) => {
						const active = queryFacets.find((facet) => {
							return facet.type === 'passrate' && facet.name === name;
						});

						return (
							<React.Fragment key={name}>
								<SearchFacetButton
									type="passrate"
									count={null}
									name={renderPassRateFacet(name)}
									setFacet={() => toggleFacet(name)}
									active={Boolean(active)}
								/>
								<Spacer />
							</React.Fragment>
						);
					})}
				</FacetToolbar>
			</ScrollView>
		</FacetContainer>
	);
};
