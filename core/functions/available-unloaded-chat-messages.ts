import {createSelector} from 'reselect';
import {Institution} from '../models/credit';
import {UniversalState} from '../types/universalState';

export const getAvailableUnloadedChatMessages = createSelector(
	[
		(state: UniversalState) => {
			return state.chatServer.availableMessagesBefore;
		},
		(state: UniversalState, university: Institution) => university,
		(state: UniversalState, university: Institution, uni_identifier: string) =>
			uni_identifier,
	],
	(
		availableMessagesBefore,
		university: Institution,
		uni_identifier: string
	) => {
		if (!availableMessagesBefore[university]) {
			return 0;
		}

		if (!availableMessagesBefore[university][uni_identifier]) {
			return 0;
		}

		return availableMessagesBefore[university][uni_identifier] || 0;
	}
);
