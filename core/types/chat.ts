import {
	ChatMessage,
	ChatMessageRequest,
	MessageDeletedPayload,
	MessageLike,
} from '../actions/chat-server';
import {Institution} from '../models/credit';

export type ChatServerState = {
	connected: boolean;
	unsentMessages: ChatMessageRequest[];
	chatInstance: SocketIOClient.Socket | null;
	messages: ChatMessage[];
	systemMessages: ChatMessage[];
	lastMessagesTimestamps: number[];
	isLoadingPreviousMessages: {[key: string]: {[key: string]: boolean}};
	loadingPreviousMessageError: {[key: string]: {[key: string]: Error | null}};
	availableMessagesBefore: {[key: string]: {[key: string]: number}};
	loadedThroughAllChat: {[key: string]: boolean};
	deletedMessages: MessageDeletedPayload[];
	typingIndicators: TypingIndicator[];
	activeUsers: {[key: string]: number};
	usersWithNotificationsEnabled: {[key: string]: number};
	lastReadTimestamps: LastReadTimestampReducerType;
	likes: MessageLike[];
	unsentLikes: string[];
	unsentUnlikes: string[];
	chatTypedAndUnsent: {
		[key: string]: string;
	};
	draftedQuotes: {
		[key: string]: string | null;
	};
	scrollToMessage: string | null;
};

export type LastReadTimestampReducerType = {
	[key: string]: {[key: string]: number};
};

export type UserMinimalInfo = {
	id: string;
	username: string;
};

export type TypingIndicator = {
	user: UserMinimalInfo;
	time: number;
	uni_identifier: string;
	university: Institution;
	id: string;
};
