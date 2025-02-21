import {createSelector} from 'reselect';
import {Institution} from '../models/credit';
import {UniversalState} from '../types/universalState';

export const isLoadingPreviousMessages = createSelector(
	[
		(state: UniversalState) => state.chatServer.isLoadingPreviousMessages,
		(state: UniversalState, university: Institution) => university,

		(state: UniversalState, university: Institution, uni_identifier: string) =>
			uni_identifier,
	],
	(isLoadingPrevMessages, university, uni_identifier): boolean => {
		if (!isLoadingPrevMessages[university]) {
			return false;
		}

		return isLoadingPrevMessages[university][uni_identifier] || false;
	}
);
