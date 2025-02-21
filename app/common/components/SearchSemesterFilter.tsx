import sortBy from 'lodash/sortBy';
import React, {useCallback, useMemo} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {Spacer} from '../../../core/components/UI/Spacer';
import {humanToPeriod} from '../../../core/functions/uzh-period';
import {AlgoliaResponseModules} from '../api/algolia';
import {SearchFacet, SearchFacetButton} from './SearchDepartmentFacet';
import {FacetContainer, FacetToolbar} from './SearchFacets';

export const SearchSemesterFilters: React.FC<{
	resultFacets: AlgoliaResponseModules['facets'];
	setFacet: (facet: SearchFacet | null) => void;
	queryFacets: SearchFacet[];
	setFacets: React.Dispatch<React.SetStateAction<SearchFacet[]>>;
}> = ({resultFacets, queryFacets, setFacets}) => {
	const semesters = useMemo(() => {
		const all = Object.entries(
			resultFacets.semester ? resultFacets.semester : []
		);

		return sortBy(all, (sem) => 0 - (humanToPeriod(sem[0]) as number));
	}, [resultFacets.semester]);

	const toggleFacet = useCallback(
		(semester: string) => {
			setFacets((facets) => {
				const index = facets.findIndex(
					(facet) => facet.type === 'semester' && facet.name === semester
				);
				if (index > -1) {
					return facets.filter((facet, i) => index !== i);
				}

				return [...facets, {type: 'semester', name: semester}];
			});
		},
		[setFacets]
	);

	return (
		<FacetContainer>
			<ScrollView horizontal showsHorizontalScrollIndicator={false}>
				<FacetToolbar>
					{semesters.map(([name, count]) => {
						const isActive = queryFacets.find(
							(q) => q.type === 'semester' && q.name === name
						);
						return (
							<React.Fragment key={name}>
								<SearchFacetButton
									key={name}
									type="semester"
									count={count}
									name={name}
									setFacet={() => toggleFacet(name)}
									active={Boolean(isActive)}
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
