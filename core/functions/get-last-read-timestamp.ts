import {Institution} from '../models/credit';
import {AppState} from '../types/app-state';

export const getLastReadTimestamp = (
	state: AppState,
	uni_identifier: string,
	university: Institution
): number => {
	return (
		state.chatServer?.lastReadTimestamps?.[university]?.[uni_identifier] || 0
	);
};
