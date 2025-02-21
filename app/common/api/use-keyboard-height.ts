import {useCallback, useEffect, useState} from 'react';
import {Keyboard, KeyboardEventListener, Platform} from 'react-native';

// On Android, since we put android:windowSoftInputMode = 'adjustPan',
// only the keyboardDidShow events are available

const SHOW_EVENT_NAME = Platform.select({
	android: 'keyboardDidShow' as const,
	default: 'keyboardWillShow' as const,
});

const HIDE_EVENT_NAME = Platform.select({
	android: 'keyboardDidHide' as const,
	default: 'keyboardWillHide' as const,
});

export function useKeyboard() {
	const [keyboardHeight, setKeyboardHeight] = useState<number>(0);

	const handleKeyboardDidShow: KeyboardEventListener = useCallback(
		(e) => {
			if (keyboardHeight !== e.endCoordinates.height) {
				setKeyboardHeight(e.endCoordinates.height);
			}
		},
		[keyboardHeight]
	);

	const handleKeyboardDidHide: KeyboardEventListener = useCallback(() => {
		setKeyboardHeight(0);
	}, []);

	useEffect(() => {
		Keyboard.addListener(SHOW_EVENT_NAME, handleKeyboardDidShow);
		Keyboard.addListener(HIDE_EVENT_NAME, handleKeyboardDidHide);

		return () => {
			Keyboard.removeListener(SHOW_EVENT_NAME, handleKeyboardDidShow);
			Keyboard.removeListener(HIDE_EVENT_NAME, handleKeyboardDidHide);
		};
	}, [handleKeyboardDidHide, handleKeyboardDidShow]);

	return keyboardHeight;
}
