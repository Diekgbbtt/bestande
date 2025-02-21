import {StyleSheet} from 'react-native';

export const globalStyles = StyleSheet.create({
	flex1: {
		flex: 1,
	},
	alignedRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	flexedRow: {
		flex: 1,
		flexDirection: 'row',
	},
	bold: {
		fontWeight: 'bold',
	},
	allCentered: {
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
	},
});
