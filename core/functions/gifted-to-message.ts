import {ChatMessage} from '../actions/chat-server';
import {Institution} from '../models/credit';
import {IMessageWithQuotes, MessageAttachment} from '../types/types';

export const giftedToMessage = (
	message: IMessageWithQuotes,
	userId: string,
	university: Institution,
	uni_identifier: string,
	quotes: string | undefined,
	attachments: MessageAttachment[] | undefined
): ChatMessage => {
	return {
		_id: String(message._id),
		text: message.text,
		createdAt: new Date(message.createdAt).getTime(),
		userId,
		university,
		uni_identifier,
		quotes,
		attachments,
	};
};
