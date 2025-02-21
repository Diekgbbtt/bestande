import {createSelector} from 'reselect';
import {ChatMessage} from '../actions/chat-server';
import {Institution} from '../models/credit';
import {UniversalState} from '../types/universalState';

export const getSystemMessagesFromChannel = createSelector(
	[
		(state: UniversalState) => state.chatServer.systemMessages,
		(state: UniversalState, university: Institution) => university,
		(state: UniversalState, university: Institution, uni_identifier) =>
			uni_identifier,
	],
	(
		systemMessages: ChatMessage[],
		university: Institution,
		uni_identifier: string
	) => {
		return systemMessages.filter(
			(m) => m.university === university && m.uni_identifier === uni_identifier
		);
	}
);
