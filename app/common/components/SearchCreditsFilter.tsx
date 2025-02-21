import React, {useCallback} from 'react';
import {ScrollView} from 'react-native';
import {Spacer} from '../../../core/components/UI/Spacer';
import {renderCreditsFacet} from './search-labels';
import {SearchFacet, SearchFacetButton} from './SearchDepartmentFacet';
import {FacetContainer, FacetToolbar} from './SearchFacets';

const creditsFacets = [
	'0-1-ects',
	'2-3-ects',
	'4-6-ects',
	'7-9-ects',
	'10plus-ects',
] as const;

export type CreditFacet = typeof creditsFacets[number];

export const SearchCreditsFilters: React.FC<{
	queryFacets: SearchFacet[];
	setFacets: React.Dispatch<React.SetStateAction<SearchFacet[]>>;
}> = ({queryFacets, setFacets}) => {
	const toggleFacet = useCallback(
		(facet: CreditFacet) => {
			setFacets((existingFacets) => {
				const index = existingFacets.findIndex((existing) => {
					return existing.type === 'credits' && existing.name === facet;
				});
				if (index > -1) {
					return existingFacets.filter((existing, i) => i !== index);
				}

				const withoutAnyCreditFacets = existingFacets.filter(
					(existing) => existing.type !== 'credits'
				);

				return [...withoutAnyCreditFacets, {name: facet, type: 'credits'}];
			});
		},
		[setFacets]
	);

	return (
		<FacetContainer>
			<ScrollView horizontal showsHorizontalScrollIndicator={false}>
				<FacetToolbar>
					{creditsFacets.map((name) => {
						const active = queryFacets.find((facet) => {
							return facet.type === 'credits' && facet.name === name;
						});
						return (
							<React.Fragment key={name}>
								<SearchFacetButton
									type="credits"
									count={null}
									active={Boolean(active)}
									name={renderCreditsFacet(name)}
									setFacet={() => toggleFacet(name)}
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
