import React, {useCallback} from 'react';
import {FlatList, ListRenderItem, StyleSheet, View} from 'react-native';
import {ActivityIndicator} from 'react-native-normalized';
import {globalStyles} from '../../../core/functions/styles';
import {AlgoliaCreditResult} from '../../../core/types/algolia-range';
import {AlgoliaResponseModules} from '../api/algolia';
import {NewLoadingMoreFooter} from './LoadingMoreFooter';
import {SearchNoResults} from './SearchNoResults';
import {TouchableSearchResult} from './TouchableSearchResult';

const styles = StyleSheet.create({
	center: {
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
	},
});

export const SearchResults: React.FC<{
	results: AlgoliaResponseModules | null;
	loadMore: () => void;
	isLoadingMore: boolean;
}> = ({results, loadMore, isLoadingMore}) => {
	const renderItem: ListRenderItem<AlgoliaCreditResult> = useCallback(
		(result) => {
			return <TouchableSearchResult result={result.item} />;
		},
		[]
	);

	const keyExtractor = useCallback((item: AlgoliaCreditResult) => {
		return item.uni_identifier + item.university + item.name;
	}, []);

	if (results === null) {
		return (
			<View style={styles.center}>
				<ActivityIndicator />
			</View>
		);
	}

	if (results.hits.length === 0) {
		return <SearchNoResults query={results.query} />;
	}

	return (
		<View style={globalStyles.flex1}>
			<FlatList
				keyboardShouldPersistTaps="handled"
				style={globalStyles.flex1}
				data={results.hits}
				keyExtractor={keyExtractor}
				renderItem={renderItem}
				onEndReached={loadMore}
				onEndReachedThreshold={0}
				ListFooterComponent={isLoadingMore ? NewLoadingMoreFooter : null}
			/>
		</View>
	);
};
