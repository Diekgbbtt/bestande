import {createSelector} from 'reselect';
import {ChatMessage} from '../actions/chat-server';
import {Institution} from '../models/credit';
import {AppState} from '../types/app-state';
import {getLastReadTimestamp} from './get-last-read-timestamp';
import {getMessagesFromChannel} from './get-messages-from-channel';

export const getUnreadMessages = createSelector(
	[
		(state: AppState, uni_identifier: string, university: Institution) =>
			getMessagesFromChannel(state, university, uni_identifier),
		(state: AppState, uni_identifier: string, university: Institution) =>
			getLastReadTimestamp(state, uni_identifier, university),
	],
	(acknowledgedMessages: ChatMessage[], timestamp: number): ChatMessage[] => {
		return acknowledgedMessages.filter((m) => m.createdAt > timestamp);
	}
);
