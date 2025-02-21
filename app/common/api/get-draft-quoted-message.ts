import {createSelector} from 'reselect';
import {getMessagesForChannelToDisplayExceptDeletedOnes} from '../../../core/functions/get-messages-for-channel-to-display';
import {Institution} from '../../../core/models/credit';
import {AppState} from '../../../core/types/app-state';

export const getDraftQuotedMessage = createSelector(
	[
		(state: AppState, institution: Institution, uni_identifier: string) =>
			getMessagesForChannelToDisplayExceptDeletedOnes(
				state,
				institution,
				uni_identifier
			),
		(state: AppState) => state.chatServer.draftedQuotes,
		(
			state: AppState,
			institution: Institution,
			uni_identifier: string,
			roomId: string
		) => roomId,
	],
	(messages, draftedQuotes, roomId) => {
		const id = draftedQuotes[roomId];
		if (!id) {
			return null;
		}

		return messages.find((m) => m._id === id);
	}
);
