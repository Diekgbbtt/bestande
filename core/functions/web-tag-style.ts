import {Platform, StyleSheet} from 'react-native';

export const webTagStyle = StyleSheet.create({
	// @ts-expect-error
	touchable: Platform.select({
		web: {
			display: 'inline-block',
		},
		default: {
			display: 'flex',
		},
	}),
});
