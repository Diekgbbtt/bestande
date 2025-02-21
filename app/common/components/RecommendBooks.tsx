import flattenDeep from 'lodash/flattenDeep';
import partition from 'lodash/partition';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {RefreshControl, SectionList, View} from 'react-native';
import {ActivityIndicator} from 'react-native-normalized';
import styled from 'styled-components/native';
import {BookExplainer} from '../../../core/components/BookMarketplace/BookExplainer';
import {BookItem} from '../../../core/components/BookMarketplace/BookItem';
import {BookNoResults} from '../../../core/components/BookMarketplace/BookNoResults';
import {getVisibleCredits} from '../../../core/functions/Credits';
import {truthy} from '../../../core/functions/truthy';
import {useAppState} from '../../../core/functions/use-app-state';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import rawStrings from '../../../core/raw-strings';
import {Book} from '../../../core/types/books';
import {fetchRecommendedBooks} from '../api/fetch-recommended-books';
import {isCreditBooked} from '../api/is-credit-booked';
import {ListHeader} from './ListHeader';

const Container = styled(View)<{}>`
	flex: 1;
	background-color: ${(props) => props.theme.BACKGROUND};
`;

const BookItemContainer = styled(View)`
	padding: 12px;
`;

export const RecommendBooks: React.FC<{}> = () => {
	const language = useLanguage();
	const [loading, setLoading] = useState(false);
	const appearance = useAppearance();
	const [recommendedBooks, setRecommendedBooks] = useState<Book[] | null>(null);
	const credits = useAppState((state) => getVisibleCredits(state));
	const [activeNonCustomCredits] = useMemo(
		() => partition(credits, (c) => isCreditBooked(c) && !c.custom),
		[credits]
	);

	const getBooks = useCallback(async () => {
		try {
			setLoading(true);
			const results = await fetchRecommendedBooks(activeNonCustomCredits);
			setRecommendedBooks(flattenDeep(results.filter((r) => r.title)));
			setLoading(false);
		} catch (err) {
			setLoading(false);
		}
	}, [activeNonCustomCredits]);

	useEffect(() => {
		getBooks();
	}, [getBooks]);

	const renderItem = useCallback(({item}) => {
		return (
			<BookItemContainer>
				<BookItem book={item} showCourse />
			</BookItemContainer>
		);
	}, []);

	const available = useMemo(
		() => (recommendedBooks ?? []).filter((r) => r.available === '1'),
		[recommendedBooks]
	);

	const unavailable = useMemo(
		() => (recommendedBooks ?? []).filter((r) => r.available !== '1'),
		[recommendedBooks]
	);

	const renderSectionHeader = useCallback(
		({section}) => {
			if (section.title === 'no-books') {
				return <BookNoResults />;
			}

			if (section.title === 'spinner') {
				return (
					<View style={{marginTop: 40}}>
						<ActivityIndicator />
					</View>
				);
			}

			if (section.title === 'header') {
				return <BookExplainer availableBooks={available} />;
			}

			return <ListHeader>{section.title}</ListHeader>;
		},
		[available]
	);

	const booksLength = recommendedBooks?.length ?? 0;
	const itemsByAvailability = useMemo(() => {
		return [
			{data: [], title: 'header'},
			...(loading
				? [
						{
							data: [],
							title: 'spinner',
						},
				  ]
				: [
						available.length > 0
							? {
									data: available,
									title: rawStrings.AVAILABLE_BOOKS[language],
							  }
							: null,
						unavailable.length > 0
							? {
									data: unavailable,
									title: rawStrings.UNAVAILABLE_BOOKS[language],
							  }
							: null,
						booksLength === 0
							? {
									data: [],
									title: 'no-books',
							  }
							: null,
				  ].filter(truthy)),
		].filter(truthy);
	}, [available, language, loading, booksLength, unavailable]);

	return (
		<Container>
			<SectionList
				refreshControl={
					<RefreshControl
						refreshing={loading && recommendedBooks !== null}
						tintColor={appearance.SUBTITLE}
						colors={[appearance.SUBTITLE]}
						onRefresh={getBooks}
					/>
				}
				sections={itemsByAvailability}
				keyExtractor={(item: Book) => item.title}
				renderItem={renderItem}
				renderSectionHeader={renderSectionHeader}
			/>
		</Container>
	);
};
