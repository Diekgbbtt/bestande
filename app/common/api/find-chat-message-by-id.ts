import {ChatMessage} from '../../../core/actions/chat-server';
import {AppState} from '../../../core/types/app-state';

export const findChatMessageById = (
	state: AppState,
	id: string
): ChatMessage | null => {
	const msg1 = state.chatServer.messages.find((m) => m._id === id);
	if (msg1) {
		return msg1;
	}

	const msg2 = state.chatServer.unsentMessages.find(
		(m) => m.message._id === id
	);
	if (msg2) {
		return msg2.message;
	}

	return null;
};
