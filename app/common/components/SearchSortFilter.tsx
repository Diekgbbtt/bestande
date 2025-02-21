import React from 'react';
import {ScrollView} from 'react-native';
import {Spacer} from '../../../core/components/UI/Spacer';
import {useLanguage} from '../../../core/functions/use-language';
import {renderSortFacet} from './search-labels';
import {SearchFacetButton} from './SearchDepartmentFacet';
import {FacetContainer, FacetToolbar} from './SearchFacets';

const sortOptions = [
	'relevance',
	'user-count',
	'rating',
	'credits',
	'passrate',
] as const;

export type SortOption = typeof sortOptions[number];

export const SearchSortFilters: React.FC<{
	sorting: SortOption;
	setSorting: React.Dispatch<React.SetStateAction<SortOption>>;
}> = ({sorting, setSorting}) => {
	const language = useLanguage();
	return (
		<FacetContainer>
			<ScrollView horizontal showsHorizontalScrollIndicator={false}>
				<FacetToolbar>
					{sortOptions.map((name) => {
						const active = name === sorting;

						return (
							<React.Fragment key={name}>
								<SearchFacetButton
									type="passrate"
									count={null}
									name={renderSortFacet(name, language)}
									setFacet={() => setSorting(name)}
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
