import memoize from 'lodash/memoize';
import sortBy from 'lodash/sortBy';
import {createSelector} from 'reselect';
import {ChatMessage, ChatMessageRequest} from '../actions/chat-server';
import {AppLanguage} from '../models/app-language';
import {Institution} from '../models/credit';
import rawStrings from '../raw-strings';
import {IMessageWithQuotes} from '../types/types';
import {UniversalState} from '../types/universalState';
import {User} from '../types/user-state';
import {addUserTagsToMessage} from './add-user-tags-to-message';
import {getAvailableUnloadedChatMessages} from './available-unloaded-chat-messages';
import {formatString} from './format-string';
import {getChatRoomIdentifier} from './get-chat-room-identifier';
import {getMessagesFromChannel} from './get-messages-from-channel';
import {getSystemMessagesFromChannel} from './get-system-messages-from-channel';
import {getUnsentMessagesFromChannel} from './get-unsent-messages-from-channel';
import {getUserPool} from './get-user-pool';
import {isLoadingPreviousMessages} from './is-loading-previous-message';
import {messagesToGifted} from './messages-to-gifted';
import {truthy} from './truthy';
import {welcomeMessageUser} from './welcome-message-user';

const getIntroductoryCTA = (
	usersWithPushNotifications: number,
	language: AppLanguage
) => {
	if (usersWithPushNotifications === 0) {
		return rawStrings.CHAT_CTA_NO_MESSAGES[language];
	}

	if (usersWithPushNotifications === 1) {
		return rawStrings.CHAT_CTA_1_OTHER_MESSAGE[language];
	}

	return formatString(
		rawStrings.CHAT_CTA_2_OTHER_MESSAGE[language],
		String(usersWithPushNotifications)
	);
};

const introductoryMessage = memoize(
	(
		language: AppLanguage,
		short_name: string,
		uni_identifier: string,
		university: Institution,
		usersWithPushNotifications: number
	) => {
		return {
			createdAt: 1568455200000,
			text: [
				formatString(rawStrings.CHAT_WELCOME_MESSAGE[language], short_name),
				getIntroductoryCTA(usersWithPushNotifications, language),
			].join(' '),
			_id: `welcome-${getChatRoomIdentifier(uni_identifier, university)}`,
			sent: true,
			user: welcomeMessageUser,
		};
	},
	(lang, short, id, uni) => lang + short + id + uni
);

const composingMessages = memoize(
	(
		university: Institution,
		uni_identifier: string,
		users: User[],
		unsentMessages: ChatMessageRequest[],
		systemMessages: ChatMessage[],
		acknowledgedMessages: ChatMessage[],
		loadedThroughAllChat: {
			[key: string]: boolean;
		},
		shouldShowIntroductoryMessage: boolean,
		language: AppLanguage,
		short_name: string | null,
		usersWithPushNotifications: number,
		highlightUsernames: boolean
	) => {
		const messages: IMessageWithQuotes[] = [
			...unsentMessages.map((m: ChatMessageRequest) =>
				messagesToGifted(m.message, false, users)
			),
			...acknowledgedMessages.map((m: ChatMessage) =>
				messagesToGifted(m, true, users)
			),
			...systemMessages.map((m) => messagesToGifted(m, true, users)),
			shouldShowIntroductoryMessage
				? introductoryMessage(
						language,
						short_name as string,
						uni_identifier,
						university,
						usersWithPushNotifications
				  )
				: null,
		]
			.filter(truthy)
			.map((m) => (highlightUsernames ? addUserTagsToMessage(m, users) : m));
		const sorted = sortBy(messages, (m) => 0 - new Date(m.createdAt).getTime());
		if (uni_identifier === 'all') {
			return sorted.filter((s) => loadedThroughAllChat[s._id]);
		}

		return sorted;
	},
	(
		university: Institution,
		uni_identifier: string,
		users: User[],
		unsentMessages: ChatMessageRequest[],
		systemMessages: ChatMessage[],
		acknowledgedMessages: ChatMessage[],
		loadedThroughAllChat: {
			[key: string]: boolean;
		},
		shouldShowIntroductoryMessage: boolean,
		language: AppLanguage,
		short_name: string
	) => {
		const usercachekey = users.map((u) => u.id + u.avatar).join('');
		const unsentmessagecachekey = unsentMessages.map((m) => m.message).join('');
		const systemmessagescachekey = systemMessages.map((m) => m._id).join('');
		const acknowledgedmessagescachekey = acknowledgedMessages
			.map((a) => a._id)
			.join('');
		const loadedThroughAllChatcachekey =
			uni_identifier === 'all'
				? Object.keys(loadedThroughAllChat)
						.map((a) => loadedThroughAllChat[a])
						.join('')
				: '';
		return (
			university +
			uni_identifier +
			usercachekey +
			unsentmessagecachekey +
			systemmessagescachekey +
			acknowledgedmessagescachekey +
			loadedThroughAllChatcachekey +
			shouldShowIntroductoryMessage +
			language +
			short_name
		);
	}
);

export const getMessagesForChannelToDisplay = (
	state: UniversalState,
	university: Institution,
	uni_identifier: string,
	language: AppLanguage,
	short_name: string | null,
	showIntroductoryMessage: boolean,
	highlightUsernames: boolean
) => {
	const users = getUserPool(state);
	const usersWithPushNotifications =
		state.chatServer.usersWithNotificationsEnabled[
			getChatRoomIdentifier(uni_identifier, university)
		] || 0;
	const acknowledgedMessages = getMessagesFromChannel(
		state,
		university,
		uni_identifier
	);
	const unsentMessages = getUnsentMessagesFromChannel(
		state,
		university,
		uni_identifier
	);
	const systemMessages = getSystemMessagesFromChannel(
		state,
		university,
		uni_identifier
	);
	const hasNoUnloadedChatMessages =
		getAvailableUnloadedChatMessages(state, university, uni_identifier) === 0;
	const previousMessageIsLoading = isLoadingPreviousMessages(
		state,
		university,
		uni_identifier
	);
	const {loadedThroughAllChat} = state.chatServer;
	const shouldShowIntroductoryMessage =
		showIntroductoryMessage &&
		hasNoUnloadedChatMessages &&
		!previousMessageIsLoading;

	return composingMessages(
		university,
		uni_identifier,
		users,
		unsentMessages,
		systemMessages,
		acknowledgedMessages,
		loadedThroughAllChat,
		shouldShowIntroductoryMessage,
		language,
		short_name,
		usersWithPushNotifications,
		highlightUsernames
	);
};

export const getMessagesForChannelToDisplayExceptDeletedOnes = createSelector(
	[
		(
			state: UniversalState,
			university: Institution,
			uni_identifier: string,
			language: AppLanguage,
			short_name: string,
			showIntroductoryMessage: boolean,
			highlightUsernames: boolean
		) =>
			getMessagesForChannelToDisplay(
				state,
				university,
				uni_identifier,
				language,
				short_name,
				showIntroductoryMessage,
				highlightUsernames
			),
		(state: UniversalState) => state.chatServer.deletedMessages,
	],
	(messages, deletedMessages) => {
		return messages.filter(
			(m) => !deletedMessages.find((deleted) => deleted.messageID === m._id)
		);
	}
);
