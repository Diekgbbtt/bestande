import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: 'transparent',
		justifyContent: 'center',
		alignItems: 'center',
	},
});

// ts-unused-exports:disable-next-line
export default class DefaultLoadingIndicator extends React.Component {
	render() {
		return (
			<View style={styles.container}>
				<ActivityIndicator />
			</View>
		);
	}
}
