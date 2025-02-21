import React, {useCallback} from 'react';
import {ScrollView} from 'react-native';
import {Spacer} from '../../../core/components/UI/Spacer';
import {renderRatingsFacet} from './search-labels';
import {SearchFacet, SearchFacetButton} from './SearchDepartmentFacet';
import {FacetContainer, FacetToolbar} from './SearchFacets';

const ratingFacets = ['2.5-plus', '3.5-plus', '4.5-plus'] as const;

export type RatingFacet = typeof ratingFacets[number];

export const SearchRatingsFilters: React.FC<{
	queryFacets: SearchFacet[];
	setFacets: React.Dispatch<React.SetStateAction<SearchFacet[]>>;
}> = ({queryFacets, setFacets}) => {
	const toggleFacet = useCallback(
		(facet: RatingFacet) => {
			setFacets((existingFacets) => {
				const index = existingFacets.findIndex((existing) => {
					return existing.type === 'ratings' && existing.name === facet;
				});
				if (index > -1) {
					return existingFacets.filter((existing, i) => i !== index);
				}

				const withoutAnyCreditFacets = existingFacets.filter(
					(existing) => existing.type !== 'ratings'
				);

				return [...withoutAnyCreditFacets, {name: facet, type: 'ratings'}];
			});
		},
		[setFacets]
	);

	return (
		<FacetContainer>
			<ScrollView horizontal showsHorizontalScrollIndicator={false}>
				<FacetToolbar>
					{ratingFacets.map((name) => {
						const active = queryFacets.find((facet) => {
							return facet.type === 'ratings' && facet.name === name;
						});
						return (
							<React.Fragment key={name}>
								<SearchFacetButton
									type="ratings"
									count={null}
									name={renderRatingsFacet(name)}
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
