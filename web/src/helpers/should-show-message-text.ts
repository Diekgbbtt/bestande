import {ChatMessage} from '../../../core/actions/chat-server';
import {
	FILE_UPGRADE_TOKEN,
	IMessageWithQuotes,
} from '../../../core/types/types';

export const shouldShowMessageText = (
	message: IMessageWithQuotes | ChatMessage
) => {
	return Boolean(message.text && message.text !== FILE_UPGRADE_TOKEN);
};
