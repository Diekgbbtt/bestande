import {Platform} from 'react-native';
import ReactNativeHaptic from 'react-native-haptic';

export const hapticFeedback = (
	type: 'impact' | 'notification' | 'selection' = 'impact'
): void => {
	if (Platform.OS === 'ios') {
		ReactNativeHaptic.generate(type);
	}
};
