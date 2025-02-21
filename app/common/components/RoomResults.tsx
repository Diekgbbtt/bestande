import React, {useCallback, useMemo} from 'react';
import {FlatList, ListRenderItem, StyleSheet, View} from 'react-native';
import {ActivityIndicator} from 'react-native-normalized';
import {SafeSideSpace} from '../../../core/components/SafeSideSpace';
import {globalStyles} from '../../../core/functions/styles';
import {RoomType} from '../../../core/types/schedule';
import {AlgoliaResponseRooms} from '../api/algolia';
import {NewLoadingMoreFooter} from './LoadingMoreFooter';
import {TouchableRoomResult} from './TouchableRoomResult';

const styles = StyleSheet.create({
	center: {
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
	},
});

export const NewRoomResults: React.FC<{
	results: AlgoliaResponseRooms;
	loadMore: () => void;
	isLoadingMore: boolean;
}> = ({results, loadMore, isLoadingMore}) => {
	const withoutEmpty = useMemo(() => {
		return (results.hits ?? []).filter((r) => r.name.trim());
	}, [results.hits]);

	const renderItem: ListRenderItem<RoomType> = useCallback((result) => {
		return <TouchableRoomResult result={result.item} />;
	}, []);

	const keyExtractor = useCallback((item: RoomType) => {
		return item.id + item.university;
	}, []);

	if (results === null) {
		return (
			<View style={styles.center}>
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<SafeSideSpace style={globalStyles.flex1}>
			<FlatList
				style={globalStyles.flex1}
				data={withoutEmpty}
				keyExtractor={keyExtractor}
				renderItem={renderItem}
				onEndReached={loadMore}
				onEndReachedThreshold={0}
				ListFooterComponent={isLoadingMore ? NewLoadingMoreFooter : null}
			/>
		</SafeSideSpace>
	);
};
