import {createSelector} from 'reselect';
import {MessageDeletedPayload} from '../actions/chat-server';
import {IMessageWithQuotes} from '../types/types';
import {UniversalState} from '../types/universalState';

export const wasMessageDeleted = createSelector(
	[
		(state: UniversalState) => state.chatServer.deletedMessages,
		(state: UniversalState, message: IMessageWithQuotes) => message,
	],
	(
		deletedMessages: MessageDeletedPayload[],
		message: IMessageWithQuotes
	): MessageDeletedPayload | null => {
		return deletedMessages.find((m) => m.messageID === message._id) || null;
	}
);
