import memoize from 'lodash/memoize';
import {ChatMessage} from '../actions/chat-server';
import {IMessageWithQuotes} from '../types/types';
import {User} from '../types/user-state';
import {addUserToMessage} from './add-user-to-message';

export const messagesToGifted = memoize(
	(
		message: ChatMessage,
		sent: boolean | undefined,
		userPool: User[]
	): IMessageWithQuotes => {
		return {
			_id: message._id,
			text: message.text,
			createdAt: message.createdAt,
			user: addUserToMessage(message, userPool),
			system: Boolean(message.system),
			quotes: message.quotes,
			attachments: message.attachments,
			sent,
		};
	},
	(m, sent) => m._id + String(sent)
);
