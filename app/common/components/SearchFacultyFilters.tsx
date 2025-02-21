import React, {useCallback, useMemo} from 'react';
import {ScrollView} from 'react-native';
import {Spacer} from '../../../core/components/UI/Spacer';
import {AlgoliaResponseModules} from '../api/algolia';
import {SearchFacet, SearchFacetButton} from './SearchDepartmentFacet';
import {FacetContainer, FacetToolbar} from './SearchFacets';

export const SearchFacultyFilters: React.FC<{
	facets: AlgoliaResponseModules['facets'];
	queryFacets: SearchFacet[];
	setFacets: React.Dispatch<React.SetStateAction<SearchFacet[]>>;
}> = ({facets, queryFacets, setFacets}) => {
	const faculty = useMemo(
		() => (facets.faculty ? Object.entries(facets.faculty) : []),
		[facets.faculty]
	);
	const departments = useMemo(() => {
		return facets.departments ? Object.entries(facets.departments) : [];
	}, [facets.departments]);

	const toggleFacet = useCallback(
		(type: 'faculty' | 'departments', semester: string) => {
			setFacets((previousFacets) => {
				const index = previousFacets.findIndex(
					(facet) => facet.type === type && facet.name === semester
				);
				if (index > -1) {
					return previousFacets.filter((facet, i) => index !== i);
				}

				return [...previousFacets, {type, name: semester}];
			});
		},
		[setFacets]
	);

	return (
		<FacetContainer>
			<ScrollView horizontal showsHorizontalScrollIndicator={false}>
				<FacetToolbar>
					{faculty.map(([name, count]) => {
						const active = queryFacets.find((facet) => {
							return facet.type === 'faculty' && facet.name === name;
						});
						return (
							<React.Fragment key={name}>
								<SearchFacetButton
									type="faculty"
									count={count}
									name={name}
									setFacet={() => toggleFacet('faculty', name)}
									active={Boolean(active)}
								/>
								<Spacer />
							</React.Fragment>
						);
					})}
					{departments.map(([name, count]) => {
						const active = queryFacets.find((facet) => {
							return facet.type === 'departments' && facet.name === name;
						});
						return (
							<React.Fragment key={name}>
								<SearchFacetButton
									key={name}
									type="departments"
									count={count}
									name={name}
									setFacet={() => toggleFacet('departments', name)}
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
