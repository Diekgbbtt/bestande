import {Institution} from '../../../core/models/credit';
import {AppState} from '../../../core/types/app-state';
import {TypingIndicator} from '../../../core/types/chat';
import {isMyTypingIndicator} from './isMyTypingIndicator';

export const getTypingIndicator = (
	state: AppState,
	uni_identifier: string,
	university: Institution
): TypingIndicator[] => {
	return state.chatServer.typingIndicators.filter(
		(ti) =>
			ti.uni_identifier === uni_identifier &&
			ti.university === university &&
			!isMyTypingIndicator(state, ti)
	);
};
