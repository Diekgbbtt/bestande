import type {Node} from 'react-native-reanimated';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const usePull = (_: {
	pixelsNeeded: number;
	onPull: () => void;
}): {
	progress: Node<number> | null;
	scrollViewProps: {
		onScroll: () => void;
		scrollEventThrottle: 16;
	};
} => {
	return {
		progress: null,
		scrollViewProps: {
			onScroll: (): void => undefined,
			scrollEventThrottle: 16,
		},
	};
};
