import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ActivityIndicator} from 'react-native-normalized';

const styles = StyleSheet.create({
	loadingMore: {
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export const NewLoadingMoreFooter: React.FC = () => {
	return (
		<View style={styles.loadingMore}>
			<ActivityIndicator />
		</View>
	);
};
