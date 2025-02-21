import {createSelector} from 'reselect';
import {ChatMessage} from '../actions/chat-server';
import {Institution} from '../models/credit';
import {UniversalState} from '../types/universalState';

export const getMessagesFromChannel = createSelector(
	[
		(state: UniversalState) => state.chatServer.messages,
		(state: UniversalState, university: Institution) => university,
		(state: UniversalState, university: Institution, uni_identifier: string) =>
			uni_identifier,
	],
	(chatMessages, university, uni_identifier): ChatMessage[] => {
		if (uni_identifier === 'all') {
			return chatMessages;
		}

		return chatMessages.filter(
			(m) => m.university === university && m.uni_identifier === uni_identifier
		);
	}
);
