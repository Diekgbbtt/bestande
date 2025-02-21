import {ChatMessage} from '../actions/chat-server';
import {IMessageWithQuotes} from '../types/types';

export const chatMessageWithOverride = (
	msg: IMessageWithQuotes | ChatMessage
) => {
	const attachment = msg.attachments?.find((a) => a.type === 'FILE_ATTACHMENT');
	if (attachment) {
		return `📎 ${attachment.fileName}`;
	}

	return msg.text;
};
