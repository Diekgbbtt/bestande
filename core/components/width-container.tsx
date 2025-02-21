import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Config} from '../data/Config';

const styles = StyleSheet.create({
	outer: Config.IS_WEBSITE
		? {
				display: ('block' as unknown) as 'flex',
		  }
		: {
				flex: 1,
		  },
	container: Config.IS_WEBSITE
		? {
				maxWidth: 1000,
				paddingLeft: 20,
				paddingRight: 20,
				marginLeft: 'auto',
				marginRight: 'auto',
				flex: 1,
		  }
		: {
				flex: 1,
		  },
});

export const ContainerWithFullWidthStyle = (
	props: any & {wrapperStyle?: any}
) => {
	const {wrapperStyle, ...otherProps} = props;
	const {style, ...otherotherProps} = otherProps;
	return (
		<View style={[styles.outer, {...wrapperStyle, flex: 1}]}>
			<View style={[styles.container, style]} {...otherotherProps} />
		</View>
	);
};
