import React, {useEffect} from 'react';
import {Platform} from 'react-native';
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import {useKeyboard} from '../api/use-keyboard-height';

export const KeyboardSpacer: React.FC<{
	additionalOffsetWhenOpen: number;
}> = ({additionalOffsetWhenOpen = 0}) => {
	const keyboardHeight = useKeyboard();
	const animatedHeight = useSharedValue(keyboardHeight);

	const heightToSet =
		keyboardHeight === 0 ? 0 : keyboardHeight - additionalOffsetWhenOpen;

	useEffect(() => {
		if (Platform.OS === 'android') {
			animatedHeight.value = heightToSet;
		} else {
			animatedHeight.value = withTiming(heightToSet, {
				easing: Easing.bezier(0.17, 0.59, 0.4, 0.77),
				duration: 250,
			});
		}
	}, [animatedHeight, heightToSet]);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			height: animatedHeight.value,
		};
	});

	return <Animated.View style={animatedStyle} />;
};
