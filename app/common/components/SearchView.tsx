import SegmentedControl from '@react-native-segmented-control/segmented-control';
import {SearchIndex} from 'algoliasearch';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
	NativeSegmentedControlIOSChangeEvent,
	NativeSyntheticEvent,
	Platform,
	ScrollView,
	View,
} from 'react-native';
import styled from 'styled-components/native';
import {Tag} from '../../../core/components/FilterBase';
import {SafeSideSpace} from '../../../core/components/SafeSideSpace';
import {Spacer} from '../../../core/components/UI/Spacer';
import {addImpression} from '../../../core/functions/api';
import {getAppearance} from '../../../core/functions/get-appearance';
import {getUserHash} from '../../../core/functions/get-user-hash';
import {globalStyles} from '../../../core/functions/styles';
import {useAppState} from '../../../core/functions/use-app-state';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import {Institution} from '../../../core/models/credit';
import {defaultSearchSemesters} from '../../../core/models/default-search-semesters';
import {SEARCH_VIEW} from '../../../core/models/impression-type';
import {ETH, UZH} from '../../../core/models/university';
import rawStrings from '../../../core/raw-strings';
import {
	AlgoliaResponseModules,
	AlgoliaResponseRooms,
	bestPassrate,
	moduleIndex,
	moduleIndexBestRating,
	mostCreditsRating,
	mostUsersIndex,
	roomsIndex,
} from '../api/algolia';
import {calculateSearchFacets} from '../api/calculate-search-facets';
import {
	calculateSearchFilters,
	calculateSearchNumericFilters,
} from '../api/calculate-search-filters';
import {NewRoomResults} from './RoomResults';
import {
	getCreditsLabel,
	getPassRateLabel,
	getRatingsLabel,
	getSearchFacultyFilterLabel,
	getSearchSemesterLabel,
	getSortLabel,
} from './search-labels';
import {SearchCreditsFilters} from './SearchCreditsFilter';
import {SearchFacet} from './SearchDepartmentFacet';
import {SearchDivider} from './SearchDivider';
import {SearchFacultyFilters} from './SearchFacultyFilters';
import {SearchPassRateFilters} from './SearchPassRateFilters';
import {SearchRatingsFilters} from './SearchRatings';
import {SearchResults} from './SearchResults';
import {SearchSemesterFilters} from './SearchSemesterFilter';
import {SearchSortFilters, SortOption} from './SearchSortFilter';
import {SearchViewFakeHeader} from './SearchViewFakeHeader';
import {
	SearchViewInputContainer,
	SearchViewInputField,
} from './SearchViewInputField';

const Container = styled(View)`
	flex: 1;
	background-color: ${(props) => props.theme.BACKGROUND};
`;

const Toolbar = styled(View)`
	flex-direction: row;
	padding-top: 10px;
	padding-bottom: 10px;
	background-color: ${(props) => props.theme.BACKGROUND};
	align-items: center;
	padding-left: 10px;
`;

const ScrollSection = styled(ScrollView).attrs({
	contentContainerStyle: {
		paddingRight: 10,
	},
})`
	padding-right: 10px;
`;

const SegmentContainer = styled(View)`
	padding: 12px;
	padding-bottom: 0;
`;

const hitsPerPage = 10;

export const SearchView: React.FC = () => {
	const inputValue = useRef('');
	const [currentSearchType, setSearchType] = useState(0);
	const [results, setResults] = useState<
		| {
				type: 'modules';
				response: AlgoliaResponseModules;
		  }
		| {
				type: 'rooms';
				response: AlgoliaResponseRooms;
		  }
		| null
	>(null);
	const identifier = useAppState((state) => getUserHash(state, null));
	const institution = useAppState((state) => state.institution.institution);

	const language = useLanguage();

	useEffect(() => {
		addImpression({
			institution,
			identifier,
			content: SEARCH_VIEW,
			platform: Platform.OS,
			language,
		})
			.then((impression) => {
				console.log('Search View Impression added', impression);
			})
			.catch((err) => {
				console.log('Error adding search view impression', err);
			});
	}, [identifier, institution, language]);
	const [university, setUniversity] = useState<Institution>('UZH');
	const [facets, setFacets] = useState<SearchFacet[]>(
		defaultSearchSemesters.map((sem) => {
			return {
				name: sem,
				type: 'semester',
			};
		})
	);
	const [sorting, setSorting] = useState<SortOption>('relevance');
	const [filterType, setFilterType] = useState<
		'faculty' | 'semester' | 'credits' | 'ratings' | 'passrate' | 'sort' | null
	>(null);
	const [loadingMore, setLoadingMore] = useState(false);

	const appearance = useAppearance();
	const theme = useAppState((state) => getAppearance(state.appearance));

	const index: SearchIndex = useMemo(() => {
		if (sorting === 'user-count') {
			return mostUsersIndex;
		}

		if (sorting === 'rating') {
			return moduleIndexBestRating;
		}

		if (sorting === 'relevance') {
			return moduleIndex;
		}

		if (sorting === 'credits') {
			return mostCreditsRating;
		}

		if (sorting === 'passrate') {
			return bestPassrate;
		}

		throw new Error('invalid sorting');
	}, [sorting]);
	const searchModules = useCallback(
		async (
			text: string,
			uni: Institution,
			queryFacets: SearchFacet[],
			offset: number
		) => {
			const searched = ((await index.search(text, {
				filters: calculateSearchFilters({
					institution: uni,
				}),
				numericFilters: calculateSearchNumericFilters({facets: queryFacets}),
				facets: ['departments', 'faculty', 'semester'],
				facetFilters: calculateSearchFacets(uni, queryFacets),
				page: Math.floor(offset / hitsPerPage),
				hitsPerPage,
			})) as unknown) as AlgoliaResponseModules;

			if (text === inputValue.current) {
				setResults((prevResults) => {
					if (prevResults && prevResults.type === 'modules' && offset > 0) {
						return {
							type: 'modules',
							response: {
								...searched,
								hits: [...prevResults.response.hits, ...searched.hits],
							},
						};
					}

					return {
						type: 'modules',
						response: searched,
					};
				});
			}
		},
		[index]
	);

	const searchRooms = useCallback(async (text: string, offset: number) => {
		const searched = ((await roomsIndex.search(text, {
			facetFilters: [[`university:UZH`, `university:ETH`]],
			hitsPerPage,
			page: Math.floor(offset / hitsPerPage) + 1,
		})) as unknown) as AlgoliaResponseRooms;

		if (text === inputValue.current) {
			setResults((prevResults) => {
				if (prevResults && prevResults.type === 'rooms' && offset > 0) {
					return {
						type: 'rooms',
						response: {
							...searched,
							hits: [...prevResults.response.hits, ...searched.hits],
						},
					};
				}

				return {
					type: 'rooms',
					response: searched,
				};
			});
		}
	}, []);

	const search = useCallback(
		(
			text: string,
			_university: Institution,
			_facets: SearchFacet[],
			offset: number
		) => {
			if (currentSearchType === 1) {
				return searchRooms(text, offset);
			}

			return searchModules(text, _university, _facets, offset);
		},
		[currentSearchType, searchModules, searchRooms]
	);

	const onTextChange = useCallback(
		async (text: string) => {
			inputValue.current = text;
			search(text, university, facets, 0);
		},
		[facets, search, university]
	);

	const switchUniversity = useCallback(() => {
		setUniversity((uni) => (uni === UZH ? ETH : UZH));
	}, []);

	const updateFacet = useCallback((newFacet: SearchFacet) => {
		setFacets((existingFacets) => {
			const removeExisting = existingFacets.filter((oldFacet) => {
				if (oldFacet.type === newFacet.type) {
					return false;
				}

				return true;
			});
			if (existingFacets.length !== removeExisting.length) {
				return removeExisting;
			}

			return [...existingFacets, newFacet];
		});
	}, []);

	const toggleFacultyFilter = useCallback(() => {
		setFilterType((f) => {
			if (f === 'faculty') {
				return null;
			}

			return 'faculty';
		});
	}, []);

	const toggleSemesterFilter = useCallback(() => {
		setFilterType((f) => {
			if (f === 'semester') {
				return null;
			}

			return 'semester';
		});
	}, []);

	const toggleCreditsFilter = useCallback(() => {
		setFilterType((f) => {
			if (f === 'credits') {
				return null;
			}

			return 'credits';
		});
	}, []);

	const toggleRatingsFilter = useCallback(() => {
		setFilterType((f) => {
			if (f === 'ratings') {
				return null;
			}

			return 'ratings';
		});
	}, []);

	const togglePassRateFilter = useCallback(() => {
		setFilterType((f) => {
			if (f === 'passrate') {
				return null;
			}

			return 'passrate';
		});
	}, []);

	const toggleSortFilter = useCallback(() => {
		setFilterType((f) => {
			if (f === 'sort') {
				return null;
			}

			return 'sort';
		});
	}, []);

	useEffect(() => {
		search(inputValue.current, university, facets, 0);
	}, [facets, search, university]);

	const searchTypes = useMemo(() => {
		return [rawStrings.MODULES[language], rawStrings.ROOMS[language]];
	}, [language]);

	const onSearchTypeChange = useCallback(
		(event: NativeSyntheticEvent<NativeSegmentedControlIOSChangeEvent>) => {
			setSearchType(event.nativeEvent.selectedSegmentIndex);
		},
		[]
	);

	const loadMore = useCallback(async () => {
		if (loadingMore) {
			return;
		}

		if (!results) {
			return;
		}

		// @ts-expect-error
		const hasMore = results.response.page < results.response.nbPages - 1;
		if (!hasMore) {
			return;
		}

		setLoadingMore(true);
		await search(
			inputValue.current,
			university,
			facets,
			results?.response.hits.length ?? 0
		);
		setLoadingMore(false);
	}, [facets, loadingMore, results, search, university]);

	return (
		<Container>
			<SearchViewFakeHeader />
			<SearchViewInputContainer>
				<SafeSideSpace>
					<SearchViewInputField
						underlineColorAndroid="transparent"
						autoCorrect={false}
						returnKeyType="search"
						clearButtonMode="always"
						placeholder={
							currentSearchType === 0
								? rawStrings.SEARCH_INPUT_PLACEHOLDER_MODULES[language]
								: rawStrings.SEARCH_INPUT_PLACEHOLDER_ROOMS[language]
						}
						placeholderTextColor={appearance.HEADER_INPUT_COLOR}
						onChangeText={onTextChange}
					/>
				</SafeSideSpace>
			</SearchViewInputContainer>
			<SegmentContainer>
				<SegmentedControl
					appearance={theme}
					values={searchTypes}
					selectedIndex={currentSearchType}
					onChange={onSearchTypeChange}
				/>
			</SegmentContainer>
			{currentSearchType === 0 ? (
				<SafeSideSpace>
					<Toolbar>
						<Tag onPress={switchUniversity}>{university}</Tag>
						<SearchDivider />
						<ScrollSection horizontal showsHorizontalScrollIndicator={false}>
							<Tag
								onPress={toggleFacultyFilter}
								active={filterType === 'faculty'}
							>
								{getSearchFacultyFilterLabel({
									facets,
									institution: university,
									language,
									active: filterType === 'faculty',
								})}
							</Tag>
							<Spacer />
							<Tag
								onPress={toggleSemesterFilter}
								active={filterType === 'semester'}
							>
								{getSearchSemesterLabel({
									facets,
									language,
									active: filterType === 'semester',
								})}
							</Tag>
							<Spacer />
							<Tag
								onPress={toggleCreditsFilter}
								active={filterType === 'credits'}
							>
								{getCreditsLabel({
									facets,
									language,
									active: filterType === 'credits',
								})}
							</Tag>
							<Spacer />
							<Tag
								onPress={toggleRatingsFilter}
								active={filterType === 'ratings'}
							>
								{getRatingsLabel({
									facets,
									language,
									active: filterType === 'ratings',
								})}
							</Tag>
							<Spacer />
							<Tag
								onPress={togglePassRateFilter}
								active={filterType === 'passrate'}
							>
								{getPassRateLabel({
									facets,
									language,
									active: filterType === 'passrate',
								})}
							</Tag>
							<Spacer />

							<Tag onPress={toggleSortFilter} active={filterType === 'sort'}>
								{getSortLabel({
									language,
									active: filterType === 'sort',
									sortOption: sorting,
								})}
							</Tag>
						</ScrollSection>
					</Toolbar>
				</SafeSideSpace>
			) : null}
			{results?.type === 'modules' && currentSearchType === 0 ? (
				<SafeSideSpace style={globalStyles.flex1}>
					{filterType === 'faculty' ? (
						<SearchFacultyFilters
							queryFacets={facets}
							facets={results.response.facets}
							setFacets={setFacets}
						/>
					) : null}
					{filterType === 'semester' ? (
						<SearchSemesterFilters
							setFacet={updateFacet}
							resultFacets={results.response.facets}
							queryFacets={facets}
							setFacets={setFacets}
						/>
					) : null}
					{filterType === 'credits' ? (
						<SearchCreditsFilters queryFacets={facets} setFacets={setFacets} />
					) : null}
					{filterType === 'ratings' ? (
						<SearchRatingsFilters queryFacets={facets} setFacets={setFacets} />
					) : null}
					{filterType === 'passrate' ? (
						<SearchPassRateFilters queryFacets={facets} setFacets={setFacets} />
					) : null}
					{filterType === 'sort' ? (
						<SearchSortFilters setSorting={setSorting} sorting={sorting} />
					) : null}
					<SearchResults
						isLoadingMore={loadingMore}
						loadMore={loadMore}
						results={results.response}
					/>
				</SafeSideSpace>
			) : null}
			{results && results.type === 'rooms' ? (
				<NewRoomResults
					isLoadingMore={loadingMore}
					loadMore={loadMore}
					results={results.response}
				/>
			) : null}
		</Container>
	);
};
