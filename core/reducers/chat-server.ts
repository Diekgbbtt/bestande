import flatten from 'lodash/flatten';
import uniqBy from 'lodash/uniqBy';
import {v4 as uuid} from 'uuid';
import {
	ChatMessage,
	ChatMessageRequest,
	MessageDeletedPayload,
} from '../actions/chat-server';
import {Institution} from '../models/credit';
import {
	ChatServerState,
	LastReadTimestampReducerType,
	UserMinimalInfo,
} from '../types/chat';
import {User} from '../types/user-state';

const initialState: ChatServerState = {
	connected: false,
	chatInstance: null,
	unsentMessages: [],
	messages: [],
	systemMessages: [],
	lastMessagesTimestamps: [],
	isLoadingPreviousMessages: {},
	loadingPreviousMessageError: {},
	availableMessagesBefore: {},
	deletedMessages: [],
	typingIndicators: [],
	activeUsers: {},
	usersWithNotificationsEnabled: {},
	lastReadTimestamps: {},
	likes: [],
	unsentLikes: [],
	unsentUnlikes: [],
	chatTypedAndUnsent: {},
	draftedQuotes: {},
	loadedThroughAllChat: {},
	scrollToMessage: null,
};

export enum ChatServerActions {
	CONNECTED = 'CHAT_SERVER_CONNECTED',
	DISCONNECTED = 'CHAT_SERVER_DISCONNECTED',
	ADD_TO_UNSENT_MESSAGES = 'ADD_TO_UNSENT_MESSAGES',
	MESSAGE_SEND_ACKNOWLEDGED = 'MESSAGE_SEND_ACKNOWLEDGED',
	NEW_MESSAGE_RECEIVED = 'NEW_MESSAGE_RECEIVED',
	START_LOADING_PREVIOUS_MESSAGES = 'START_LOADING_PREVIOUS_MESSAGES',
	LOADED_PREVIOUS_MESSAGES = 'LOADED_PREVIOUS_MESSAGES',
	ERROR_LOADING_PREVIOUS_MESSAGES = 'ERROR_LOADING_PREVIOUS_MESSAGES',
	NEW_SYSTEM_MESSAGE = 'NEW_SYSTEM_MESSAGE',
	ADD_LAST_MESSAGE_TIMESTAMP = 'ADD_LAST_MESSAGE_TIMESTAMP',
	MESSAGE_DELETED = 'MESSAGE_DELETED',
	USER_STARTED_TYPING = 'USER_STARTED_TYPING',
	USER_STOPPED_TYPING = 'USER_STOPPED_TYPING',
	CANCEL_TYPING_INDICATORS = 'CANCEL_TYPING_INDICATORS',
	RECEIVE_ACTIVE_USER_COUNT = 'RECEIVE_ACTIVE_USER_COUNT',
	USER_READ_CHAT = 'USER_READ_CHAT',
	SET_READ_TIMESTAMP_STATE = 'SET_READ_TIMESTAMP_STATE',
	RECEIVE_NEW_MESSAGE_LIKE = 'RECEIVE_NEW_MESSAGE_LIKE',
	RECEIVE_MESSAGE_UNLIKE = 'RECEIVE_MESSAGE_UNLIKE',
	ADD_TO_UNSENT_LIKES = 'ADD_TO_UNSENT_LIKES',
	LIKE_ACKNOWLEDGED = 'LIKE_ACKNOWLEDGED',
	SIGNAL_UNLIKE = 'SIGNAL_UNLIKE',
	SET_TYPED_AND_UNSENT = 'SET_TYPED_AND_UNSENT',
	SET_ALL_TYPED_AND_UNSENT = 'SET_ALL_TYPED_AND_UNSENT',
	QUOTE_MESSAGE = 'QUOTE_MESSAGE',
	UNQUOTE_MESSAGE = 'UNQUOTE_MESSAGE',
	SCROLL_TO_MESSAGE = 'SCROLL_TO_MESSAGE',
	RESET_SCROLL_TO_MESSAGE = 'RESET_SCROLL_TO_MESSAGE',
}

type ConnectAction = {
	type: ChatServerActions.CONNECTED;
	socket: SocketIOClient.Socket;
};

export const chatserverConnected = (
	chatInstance: SocketIOClient.Socket
): ConnectAction => {
	return {
		type: ChatServerActions.CONNECTED,
		socket: chatInstance,
	};
};

type DisconnectAction = {
	type: ChatServerActions.DISCONNECTED;
};

export const chatServerDisconnected = (): DisconnectAction => {
	return {
		type: ChatServerActions.DISCONNECTED,
	};
};

type AddToUnsentMessages = {
	type: ChatServerActions.ADD_TO_UNSENT_MESSAGES;
	messageRequest: ChatMessageRequest;
};

export const addToUnsentMessages = (
	messageRequest: ChatMessageRequest
): AddToUnsentMessages => {
	return {
		type: ChatServerActions.ADD_TO_UNSENT_MESSAGES,
		messageRequest,
	};
};

type MessageSendAcknowledged = {
	type: ChatServerActions.MESSAGE_SEND_ACKNOWLEDGED;
	messageId: string;
};

export const messageSendAcknowledged = (
	messageId: string
): MessageSendAcknowledged => {
	return {
		type: ChatServerActions.MESSAGE_SEND_ACKNOWLEDGED,
		messageId,
	};
};

type NewSystemMessage = {
	type: ChatServerActions.NEW_SYSTEM_MESSAGE;
	message: ChatMessage;
};

export const newSystemMessage = (message: ChatMessage): NewSystemMessage => {
	return {
		type: ChatServerActions.NEW_SYSTEM_MESSAGE,
		message,
	};
};

type NewMessageReceived = {
	type: ChatServerActions.NEW_MESSAGE_RECEIVED;
	message: ChatMessage;
};

export const newMessageReceived = (
	message: ChatMessage
): NewMessageReceived => {
	return {
		type: ChatServerActions.NEW_MESSAGE_RECEIVED,
		message,
	};
};

type StartLoadingPreviousMessages = {
	type: ChatServerActions.START_LOADING_PREVIOUS_MESSAGES;
	uni_identifier: string;
	university: Institution | null;
};

export const startLoadingPreviousMessages = (
	uni_identifier: string,
	university: Institution | null
): StartLoadingPreviousMessages => ({
	type: ChatServerActions.START_LOADING_PREVIOUS_MESSAGES,
	uni_identifier,
	university,
});

export type LoadedPreviousMessages = {
	type: ChatServerActions.LOADED_PREVIOUS_MESSAGES;
	uni_identifier: string;
	university: Institution | null;
	messages: ChatMessage[];
	systemMessages: ChatMessage[];
	availableMessagesBefore: number;
	users: User[];
	clearExisting: boolean;
};

export const loadedPreviousMessages = (
	uni_identifier: string,
	university: Institution | null,
	messages: ChatMessage[],
	systemMessages: ChatMessage[],
	availableMessagesBefore: number,
	users: User[],
	clearExisting: boolean
): LoadedPreviousMessages => ({
	type: ChatServerActions.LOADED_PREVIOUS_MESSAGES,
	uni_identifier,
	university,
	messages,
	availableMessagesBefore,
	users,
	clearExisting,
	systemMessages,
});

type ErrorLoadingPreviousMessages = {
	type: ChatServerActions.ERROR_LOADING_PREVIOUS_MESSAGES;
	uni_identifier: string;
	university: Institution | null;
	error: Error;
};

export const errorLoadingPreviousMessages = (
	uni_identifier: string,
	university: Institution | null,
	error: Error
): ErrorLoadingPreviousMessages => ({
	type: ChatServerActions.ERROR_LOADING_PREVIOUS_MESSAGES,
	uni_identifier,
	university,
	error,
});

type AddLastMessageTimestamp = {
	type: ChatServerActions.ADD_LAST_MESSAGE_TIMESTAMP;
	timestamp: number;
};

export const addLastMessageTimestamp = (
	timestamp: number
): AddLastMessageTimestamp => {
	return {
		type: ChatServerActions.ADD_LAST_MESSAGE_TIMESTAMP,
		timestamp,
	};
};

type MessageDeleted = {
	type: ChatServerActions.MESSAGE_DELETED;
	payload: MessageDeletedPayload;
};

export const messageDeleted = (
	payload: MessageDeletedPayload
): MessageDeleted => {
	return {
		type: ChatServerActions.MESSAGE_DELETED,
		payload,
	};
};

type UserStartedTyping = {
	type: ChatServerActions.USER_STARTED_TYPING;
	user: UserMinimalInfo;
	uni_identifier: string;
	university: Institution;
};

export const userStartedTyping = (
	userMinimalInfo: UserMinimalInfo,
	uni_identifier: string,
	university: Institution
): UserStartedTyping => {
	return {
		type: ChatServerActions.USER_STARTED_TYPING,
		user: userMinimalInfo,
		uni_identifier,
		university,
	};
};

type UserStoppedTyping = {
	type: ChatServerActions.USER_STOPPED_TYPING;
	userId: string;
	uni_identifier: string;
	university: Institution;
};

export const userStoppedTyping = (
	userId: string,
	uni_identifier: string,
	university: Institution
): UserStoppedTyping => {
	return {
		type: ChatServerActions.USER_STOPPED_TYPING,
		userId,
		uni_identifier,
		university,
	};
};

type UserReadChat = {
	type: ChatServerActions.USER_READ_CHAT;
	uni_identifier: string;
	university: Institution;
};

export const userReadChat = (
	uni_identifier: string,
	university: Institution
): UserReadChat => {
	return {
		type: ChatServerActions.USER_READ_CHAT,
		uni_identifier,
		university,
	};
};

type CancelTypingIndicators = {
	type: ChatServerActions.CANCEL_TYPING_INDICATORS;
	typingIndicators: string[];
};

export const cancelTypingIndicators = (
	typingIndicators: string[]
): CancelTypingIndicators => {
	return {
		type: ChatServerActions.CANCEL_TYPING_INDICATORS,
		typingIndicators,
	};
};

type ReceiveActiveUsersCount = {
	type: ChatServerActions.RECEIVE_ACTIVE_USER_COUNT;
	channelId: string;
	users: number;
	notificationsEnabled: number;
};

export const receiveActiveUsersCount = (
	channelId: string,
	users: number,
	notificationsEnabled: number
) => ({
	type: ChatServerActions.RECEIVE_ACTIVE_USER_COUNT,
	channelId,
	users,
	notificationsEnabled,
});

type SetReadTimestampState = {
	type: ChatServerActions.SET_READ_TIMESTAMP_STATE;
	timestampsState: LastReadTimestampReducerType | null;
};

export const setReadTimestampState = (
	timestampsState: LastReadTimestampReducerType | null
): SetReadTimestampState => {
	return {
		type: ChatServerActions.SET_READ_TIMESTAMP_STATE,
		timestampsState,
	};
};

type ReceiveNewMessageLike = {
	type: ChatServerActions.RECEIVE_NEW_MESSAGE_LIKE;
	messageId: string;
	likedBy: User;
};

export const receiveMessageLike = (
	messageId: string,
	likedBy: User
): ReceiveNewMessageLike => {
	return {
		type: ChatServerActions.RECEIVE_NEW_MESSAGE_LIKE,
		messageId,
		likedBy,
	};
};

type ReceiveMessageUnlike = {
	type: ChatServerActions.RECEIVE_MESSAGE_UNLIKE;
	messageId: string;
	userId: string;
};

export const receiveMessageUnlike = (
	messageId: string,
	userId: string
): ReceiveMessageUnlike => {
	return {
		type: ChatServerActions.RECEIVE_MESSAGE_UNLIKE,
		messageId,
		userId,
	};
};

type AddToUnsentLikes = {
	type: ChatServerActions.ADD_TO_UNSENT_LIKES;
	messageId: string;
};

export const addToUnsentLikes = (messageId: string): AddToUnsentLikes => {
	return {
		type: ChatServerActions.ADD_TO_UNSENT_LIKES,
		messageId,
	};
};

type LikeAcknowledged = {
	type: ChatServerActions.LIKE_ACKNOWLEDGED;
	messageId: string;
	likedBy: string;
};

export const likeAcknowledged = (
	messageId: string,
	likedBy: string
): LikeAcknowledged => {
	return {
		type: ChatServerActions.LIKE_ACKNOWLEDGED,
		messageId,
		likedBy,
	};
};

type SignalUnlike = {
	type: ChatServerActions.SIGNAL_UNLIKE;
	messageId: string;
};

export const signalUnlike = (messageId: string): SignalUnlike => ({
	type: ChatServerActions.SIGNAL_UNLIKE,
	messageId,
});

type SetTypedAndUnsent = {
	type: ChatServerActions.SET_TYPED_AND_UNSENT;
	channelId: string;
	text: string;
};

export const setTypedAndUnsent = (
	channelId: string,
	text: string
): SetTypedAndUnsent => {
	return {
		type: ChatServerActions.SET_TYPED_AND_UNSENT,
		channelId,
		text,
	};
};

type SetAllTypedAndUnsent = {
	type: ChatServerActions.SET_ALL_TYPED_AND_UNSENT;
	typed: {[key: string]: string};
};

export const setAllTypedAndUnsent = (typed: {
	[key: string]: string;
}): SetAllTypedAndUnsent => {
	return {
		type: ChatServerActions.SET_ALL_TYPED_AND_UNSENT,
		typed,
	};
};

type QuoteMessage = {
	type: ChatServerActions.QUOTE_MESSAGE;
	channelId: string;
	messageId: string;
};

export const quoteMessage = (
	channelId: string,
	messageId: string
): QuoteMessage => {
	return {
		type: ChatServerActions.QUOTE_MESSAGE,
		channelId,
		messageId,
	};
};

type UnquoteMessage = {
	type: ChatServerActions.UNQUOTE_MESSAGE;
	channelId: string;
};

export const unquoteMessage = (channelId: string): UnquoteMessage => {
	return {
		type: ChatServerActions.UNQUOTE_MESSAGE,
		channelId,
	};
};

type ScrollToMessage = {
	type: ChatServerActions.SCROLL_TO_MESSAGE;
	messageId: string;
};

export const scrollToMessage = (messageId: string) => {
	return {
		type: ChatServerActions.SCROLL_TO_MESSAGE,
		messageId,
	};
};

type ResetScrollToMessage = {
	type: ChatServerActions.RESET_SCROLL_TO_MESSAGE;
};

export const resetScrollToMessage = () => {
	return {
		type: ChatServerActions.RESET_SCROLL_TO_MESSAGE,
	};
};

export const chatserverReducer = (
	state: ChatServerState = initialState,
	action:
		| ConnectAction
		| DisconnectAction
		| AddToUnsentMessages
		| MessageSendAcknowledged
		| NewMessageReceived
		| StartLoadingPreviousMessages
		| LoadedPreviousMessages
		| ErrorLoadingPreviousMessages
		| NewSystemMessage
		| AddLastMessageTimestamp
		| MessageDeleted
		| UserStartedTyping
		| UserStoppedTyping
		| CancelTypingIndicators
		| ReceiveActiveUsersCount
		| UserReadChat
		| SetReadTimestampState
		| ReceiveNewMessageLike
		| ReceiveMessageUnlike
		| AddToUnsentLikes
		| LikeAcknowledged
		| SignalUnlike
		| SetTypedAndUnsent
		| SetAllTypedAndUnsent
		| QuoteMessage
		| UnquoteMessage
		| ScrollToMessage
		| ResetScrollToMessage
): ChatServerState => {
	if (action.type === ChatServerActions.SET_TYPED_AND_UNSENT) {
		return {
			...state,
			chatTypedAndUnsent: {
				...state.chatTypedAndUnsent,
				[action.channelId]: action.text,
			},
		};
	}

	if (action.type === ChatServerActions.SCROLL_TO_MESSAGE) {
		return {
			...state,
			scrollToMessage: action.messageId,
		};
	}

	if (action.type === ChatServerActions.RESET_SCROLL_TO_MESSAGE) {
		return {
			...state,
			scrollToMessage: null,
		};
	}

	if (action.type === ChatServerActions.SET_ALL_TYPED_AND_UNSENT) {
		return {
			...state,
			chatTypedAndUnsent: action.typed,
		};
	}

	if (action.type === ChatServerActions.CONNECTED) {
		return {
			...state,
			chatInstance: action.socket,
			connected: true,
		};
	}

	if (action.type === ChatServerActions.DISCONNECTED) {
		return {
			...state,
			chatInstance: null,
			connected: false,
		};
	}

	if (action.type === ChatServerActions.ADD_TO_UNSENT_MESSAGES) {
		return {
			...state,
			unsentMessages: [...state.unsentMessages, action.messageRequest],
		};
	}

	if (action.type === ChatServerActions.ADD_TO_UNSENT_LIKES) {
		return {
			...state,
			unsentLikes: [...state.unsentLikes, action.messageId],
		};
	}

	if (action.type === ChatServerActions.MESSAGE_SEND_ACKNOWLEDGED) {
		const messageRequest = state.unsentMessages.find(
			(m) => m.message._id === action.messageId
		);
		if (!messageRequest) {
			return state;
		}

		return {
			...state,
			unsentMessages: state.unsentMessages.filter(
				(m) => m.message._id !== action.messageId
			),
			messages: [...state.messages, messageRequest.message],
			loadedThroughAllChat: {
				...state.loadedThroughAllChat,
				[action.messageId]: true,
			},
		};
	}

	if (action.type === ChatServerActions.NEW_MESSAGE_RECEIVED) {
		return {
			...state,
			messages: uniqBy([...state.messages, action.message], (m) => m._id),
			typingIndicators: state.typingIndicators.filter((ti) => {
				return !(
					ti.uni_identifier === action.message.uni_identifier &&
					ti.university === action.message.uni_identifier &&
					ti.user.id === action.message.userId
				);
			}),
		};
	}

	if (action.type === ChatServerActions.START_LOADING_PREVIOUS_MESSAGES) {
		return {
			...state,
			isLoadingPreviousMessages: {
				...state.isLoadingPreviousMessages,
				[String(action.university)]: {
					...state.isLoadingPreviousMessages[String(action.university)],
					[action.uni_identifier]: true,
				},
			},
			loadingPreviousMessageError: {
				...state.loadingPreviousMessageError,
				[String(action.university)]: {
					...state.loadingPreviousMessageError[String(action.university)],
					[action.uni_identifier]: null,
				},
			},
		};
	}

	if (action.type === ChatServerActions.QUOTE_MESSAGE) {
		return {
			...state,
			draftedQuotes: {
				...state.draftedQuotes,
				[action.channelId]: action.messageId,
			},
		};
	}

	if (action.type === ChatServerActions.UNQUOTE_MESSAGE) {
		return {
			...state,
			draftedQuotes: {
				...state.draftedQuotes,
				[action.channelId]: null,
			},
		};
	}

	if (action.type === ChatServerActions.LOADED_PREVIOUS_MESSAGES) {
		let oldMessages = state.messages;
		if (action.clearExisting) {
			oldMessages = state.messages.filter(
				(m) =>
					!(
						m.uni_identifier === action.uni_identifier &&
						m.university === action.university
					)
			);
		}

		let oldSystemMessages = state.systemMessages;
		if (action.clearExisting) {
			oldSystemMessages = state.systemMessages.filter(
				(m) =>
					!(
						m.uni_identifier === action.uni_identifier &&
						m.university === action.university
					)
			);
		}

		return {
			...state,
			messages: uniqBy([...oldMessages, ...action.messages], (m) => m._id),
			systemMessages: uniqBy(
				[...oldSystemMessages, ...action.systemMessages],
				(m) => m._id
			),
			isLoadingPreviousMessages: {
				...state.isLoadingPreviousMessages,
				[String(action.university)]: {
					...state.isLoadingPreviousMessages[String(action.university)],
					[action.uni_identifier]: false,
				},
			},
			loadingPreviousMessageError: {
				...state.loadingPreviousMessageError,
				[String(action.university)]: {
					...state.loadingPreviousMessageError[String(action.university)],
					[action.uni_identifier]: null,
				},
			},
			availableMessagesBefore: {
				...state.availableMessagesBefore,
				[String(action.university)]: {
					...state.availableMessagesBefore[String(action.university)],
					[action.uni_identifier]: action.availableMessagesBefore,
				},
			},
			likes: uniqBy(
				[
					...flatten(
						action.messages.map((m) =>
							(m.likes || []).map((l) => ({
								messageId: m._id,
								likedBy: l,
							}))
						)
					),
					...state.likes,
				],
				(m) => m.likedBy + m.messageId
			),
			loadedThroughAllChat:
				action.uni_identifier === 'all'
					? {
							...state.loadedThroughAllChat,
							...action.messages.reduce((a, b) => {
								return {...a, [b._id]: true};
							}, {}),
					  }
					: state.loadedThroughAllChat,
		};
	}

	if (action.type === ChatServerActions.ERROR_LOADING_PREVIOUS_MESSAGES) {
		return {
			...state,
			isLoadingPreviousMessages: {
				...state.isLoadingPreviousMessages,
				[String(action.university)]: {
					...state.isLoadingPreviousMessages[String(action.university)],
					[action.uni_identifier]: false,
				},
			},
			loadingPreviousMessageError: {
				...state.loadingPreviousMessageError,
				[String(action.university)]: {
					...state.loadingPreviousMessageError[String(action.university)],
					[action.uni_identifier]: action.error,
				},
			},
		};
	}

	if (action.type === ChatServerActions.NEW_SYSTEM_MESSAGE) {
		return {
			...state,
			systemMessages: uniqBy(
				[...state.systemMessages, action.message],
				(m) => m._id
			),
		};
	}

	if (action.type === ChatServerActions.ADD_LAST_MESSAGE_TIMESTAMP) {
		return {
			...state,
			lastMessagesTimestamps: [
				...state.lastMessagesTimestamps,
				action.timestamp,
			],
		};
	}

	if (action.type === ChatServerActions.MESSAGE_DELETED) {
		return {
			...state,
			deletedMessages: [...state.deletedMessages, action.payload],
		};
	}

	if (action.type === ChatServerActions.USER_STARTED_TYPING) {
		return {
			...state,
			typingIndicators: uniqBy(
				[
					{
						user: action.user,
						uni_identifier: action.uni_identifier,
						university: action.university,
						time: Date.now(),
						id: uuid(),
					},
					...state.typingIndicators,
				],
				(ti) => ti.uni_identifier + ti.university + ti.user.id
			),
		};
	}

	if (action.type === ChatServerActions.USER_STOPPED_TYPING) {
		return {
			...state,
			typingIndicators: state.typingIndicators.filter((ti) => {
				return !(
					ti.uni_identifier === action.uni_identifier &&
					ti.university === action.university &&
					ti.user.id === action.userId
				);
			}),
		};
	}

	if (action.type === ChatServerActions.CANCEL_TYPING_INDICATORS) {
		return {
			...state,
			typingIndicators: state.typingIndicators.filter(
				(t) => !action.typingIndicators.includes(t.id)
			),
		};
	}

	if (action.type === ChatServerActions.RECEIVE_ACTIVE_USER_COUNT) {
		return {
			...state,
			activeUsers: {
				...state.activeUsers,
				[action.channelId]: action.users,
			},
			usersWithNotificationsEnabled: {
				...state.usersWithNotificationsEnabled,
				[action.channelId]: action.notificationsEnabled,
			},
		};
	}

	if (action.type === ChatServerActions.USER_READ_CHAT) {
		return {
			...state,
			lastReadTimestamps: {
				[action.university]: {
					...state.lastReadTimestamps[action.university],
					[action.uni_identifier]: Date.now(),
				},
			},
		};
	}

	if (action.type === ChatServerActions.SET_READ_TIMESTAMP_STATE) {
		return {
			...state,
			lastReadTimestamps: action.timestampsState || {},
		};
	}

	if (action.type === ChatServerActions.RECEIVE_NEW_MESSAGE_LIKE) {
		return {
			...state,
			likes: uniqBy(
				[
					{
						messageId: action.messageId,
						likedBy: action.likedBy.id,
					},
					...state.likes,
				],
				(m) => m.likedBy + m.messageId
			),
		};
	}

	if (action.type === ChatServerActions.RECEIVE_MESSAGE_UNLIKE) {
		return {
			...state,
			likes: state.likes.filter(
				(l) =>
					!(l.likedBy === action.userId && l.messageId === action.messageId)
			),
			unsentUnlikes: state.unsentLikes.filter((u) => u !== action.messageId),
		};
	}

	if (action.type === ChatServerActions.LIKE_ACKNOWLEDGED) {
		return {
			...state,
			unsentLikes: state.unsentLikes.filter((u) => u !== action.messageId),
			likes: uniqBy(
				[
					{
						messageId: action.messageId,
						likedBy: action.likedBy,
					},
					...state.likes,
				],
				(m) => m.likedBy + m.messageId
			),
		};
	}

	if (action.type === ChatServerActions.SIGNAL_UNLIKE) {
		return {
			...state,
			unsentUnlikes: [action.messageId, ...state.unsentUnlikes],
		};
	}

	return state;
};
