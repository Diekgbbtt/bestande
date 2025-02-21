import {createSelector} from 'reselect';
import {Institution} from '../models/credit';
import {UniversalState} from '../types/universalState';

export const getUnsentMessagesFromChannel = createSelector(
	[
		(state: UniversalState) => state.chatServer.unsentMessages,
		(state: UniversalState, university: Institution) => university,
		(state: UniversalState, university: Institution, uni_identifier: string) =>
			uni_identifier,
	],
	(unsentMessages, university, uni_identifier) =>
		unsentMessages.filter(
			(m) =>
				m.message.university === university &&
				m.message.uni_identifier === uni_identifier
		)
);
