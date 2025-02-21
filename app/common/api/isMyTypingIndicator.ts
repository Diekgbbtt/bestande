import {AppState} from '../../../core/types/app-state';
import {TypingIndicator} from '../../../core/types/chat';

export const isMyTypingIndicator = (
	state: AppState,
	typingIndicator: TypingIndicator
): boolean => {
	if (!state.users.userProfile) {
		return false;
	}

	return typingIndicator.user.id === state.users.userProfile?.id;
};
