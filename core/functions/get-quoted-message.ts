import {createSelector} from 'reselect';
import {AppLanguage} from '../models/app-language';
import {Institution} from '../models/credit';
import {AppState} from '../types/app-state';
import {getMessagesForChannelToDisplayExceptDeletedOnes} from './get-messages-for-channel-to-display';

export const getQuotedMessage = createSelector(
	[
		(
			state: AppState,
			institution: Institution,
			uni_identifier: string,
			messageId: string,
			language: AppLanguage,
			short_name: string,
			showIntroductoryMessage: boolean,
			highlightUsernames: boolean
		) =>
			getMessagesForChannelToDisplayExceptDeletedOnes(
				state,
				institution,
				uni_identifier,
				language,
				short_name,
				showIntroductoryMessage,
				highlightUsernames
			),
		(
			state: AppState,
			institution: Institution,
			uni_identifier: string,
			messageId
		) => messageId,
	],
	(messages, messageId) => {
		return messages.find((m) => m._id === messageId);
	}
);
