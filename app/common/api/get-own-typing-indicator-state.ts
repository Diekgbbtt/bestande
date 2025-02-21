import {Institution} from '../../../core/models/credit';
import {AppState} from '../../../core/types/app-state';
import {TypingIndicator} from '../../../core/types/chat';

export const getOwnTypingIndicatorState = (
	state: AppState,
	uni_identifier: string,
	university: Institution
): TypingIndicator => {
	return state.chatServer.typingIndicators.find(
		(ti) =>
			ti.uni_identifier === uni_identifier &&
			ti.university === university &&
			ti.user.id === state.users.userProfile?.id
	) as TypingIndicator;
};
