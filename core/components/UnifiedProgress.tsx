import React, {ReactElement} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {ActivityIndicator, Text} from 'react-native-normalized';
import {Colors} from '../functions/Colors';

const styles = StyleSheet.create({
	text: {
		color: 'gray',
		marginTop: 10,
		marginLeft: 8,
	},
	emptyWrapper: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export const UnifiedProgress = (props: {
	text?: string | ReactElement;
	left?: boolean;
}) => {
	const text = props.text ? (
		<Text style={styles.text}>{props.text}</Text>
	) : null;
	return (
		<View
			style={[
				styles.emptyWrapper,
				props.left ? {alignItems: 'flex-start'} : {},
			]}
		>
			<ActivityIndicator
				animating
				size="small"
				color={Platform.OS === 'android' ? Colors.Blue : undefined}
			/>
			{text}
		</View>
	);
};
