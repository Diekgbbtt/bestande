import {useEffect, useState} from 'react';
import {AppState, AppStateStatus} from 'react-native';

export function useActiveState(): AppStateStatus {
	const {currentState} = AppState;
	const [appState, setAppState] = useState(currentState);

	function onChange(newState) {
		setAppState(newState);
	}

	useEffect(() => {
		AppState.addEventListener('change', onChange);

		return () => {
			AppState.removeEventListener('change', onChange);
		};
	});

	return appState;
}
