import {useCallback, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {setAppearanceMode} from '../../../core/reducers/appearance';
import {Appearance} from '../../../core/types/appearance-state';
import {darkModeEventEmitter} from '../api/dark-mode-event-emitter';

export const DarkModeWatcher = () => {
	const dispatch = useDispatch();
	const onChange = useCallback(
		(newMode: Appearance) => {
			dispatch(setAppearanceMode(newMode));
		},
		[dispatch]
	);
	useEffect(() => {
		darkModeEventEmitter.on('currentModeChanged', onChange);
		return () => {
			if (darkModeEventEmitter) {
				darkModeEventEmitter.off('currentModeChanged', onChange);
			}
		};
	}, [onChange]);
	return null;
};
