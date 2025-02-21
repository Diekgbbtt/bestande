import React, {FunctionComponent} from 'react';
import {Platform, TouchableOpacity, TouchableOpacityProps} from 'react-native';

const WebTouchable: FunctionComponent<TouchableOpacityProps> = (
	props: TouchableOpacityProps
) => {
	const {onPress, ...otherProps} = props;
	const webCompatibleProps = Platform.select({
		web: {
			onClick: onPress,
			onPress,
		},
		default: {
			onPress,
		},
	});
	return <TouchableOpacity {...webCompatibleProps} {...otherProps} />;
};

export default WebTouchable;
