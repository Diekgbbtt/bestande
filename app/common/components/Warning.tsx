import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Image, Text} from 'react-native-normalized';
import {useAppearance} from '../../../core/functions/use-appearance';

const styles = StyleSheet.create({
	warning: {
		paddingLeft: 12,
		paddingTop: 8,
		paddingBottom: 8,
		borderBottomWidth: 1,
		flexDirection: 'row',
		flex: 1,
		alignItems: 'center',
	},
	warningLeft: {
		flex: 1.2,
		opacity: 0.3,
	},
	warningIcon: {
		height: 20,
		width: 20,
	},
	warningMiddle: {
		flex: 12,
		paddingRight: 8,
	},
	warningRight: {
		flex: 1.2,
		opacity: 0.2,
	},
});

export const Warning = (props: {label: string}) => {
	const appearance = useAppearance();
	return (
		<View
			style={[
				styles.warning,
				{
					backgroundColor: appearance.BACKGROUND,
					borderBottomColor: appearance.BORDER_COLOR,
				},
			]}
		>
			<View style={styles.warningLeft}>
				<Image
					style={[
						styles.warningIcon,
						{
							tintColor: appearance.ICON_TINT,
						},
					]}
					source={require('../assets/twotone_warning_black_48dp.png')}
				/>
			</View>
			<View style={styles.warningMiddle}>
				<Text style={{color: appearance.TITLE}}>{props.label}</Text>
			</View>
			<View style={styles.warningRight}>
				<Image
					style={{
						height: 25,
						width: 20,
						tintColor: appearance.ICON_TINT,
					}}
					source={require('../assets/chevron_right.png')}
				/>
			</View>
		</View>
	);
};
