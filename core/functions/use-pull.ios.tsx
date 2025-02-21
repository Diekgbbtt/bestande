import Animated, {
	call,
	event,
	greaterThan,
	lessThan,
	useCode,
	Value,
} from 'react-native-reanimated';
import {hapticFeedback} from './HapticFeedback';

// ts-unused-exports:disable-next-line
export const usePull = (config: {
	pixelsNeeded: number;
	onPull: () => void;
}): {
	progress: Animated.Node<number> | null;
	scrollViewProps: {
		onScroll: () => void;
		scrollEventThrottle: 16;
	};
} => {
	const value = new Value<number>(0);
	const overThreshold = new Value<number>(0);
	const onScroll = event([
		{
			nativeEvent: {
				contentOffset: {
					y: value,
				},
			},
		},
	]);
	useCode(
		() =>
			Animated.cond(
				Animated.and(
					greaterThan(0 - config.pixelsNeeded, value),
					Animated.not(overThreshold)
				),
				[
					Animated.set(overThreshold, 1),
					call([], () => {
						config.onPull();
						hapticFeedback('impact');
					}),
				],
				Animated.cond(
					Animated.and(lessThan(0 - config.pixelsNeeded, value), overThreshold),
					[Animated.set(overThreshold, 0)]
				)
			),
		[config.onPull]
	);
	return {
		progress: Animated.interpolateNode(value, {
			inputRange: [0 - config.pixelsNeeded, 0 - 0.1 * config.pixelsNeeded],
			outputRange: [1, 0],
		}),
		scrollViewProps: {
			onScroll,
			scrollEventThrottle: 16,
		},
	};
};
