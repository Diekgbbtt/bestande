import uniq from 'lodash/uniq';
import {Institution} from '../models/credit';
import {UserMinimalInfo} from '../types/chat';
import {ExpandedExamReturnStatistic, MessageAttachment} from '../types/types';
import {User} from '../types/user-state';

export type SystemMessageMetadata =
	| UsernameChangedMetadata
	| ExamReturnedMetadata;

export type ChatMessage = {
	_id: string;
	text: string;
	createdAt: number;
	uni_identifier: string;
	university: Institution;
	userId: string;
	system?: boolean;
	systemMessageMetadata?: SystemMessageMetadata;
	likes?: string[];
	quotes?: string;
	attachments?: MessageAttachment[];
};

export const likeMessage = (msg: ChatMessage, id: string): ChatMessage => ({
	...msg,
	likes: msg.likes ? uniq([id, ...msg.likes]) : [id],
});

export const unlikeMessage = (msg: ChatMessage, id: string): ChatMessage => ({
	...msg,
	likes: msg.likes ? uniq(msg.likes.filter((l) => l !== id)) : [],
});

export type MessageLike = {
	messageId: string;
	likedBy: string;
};

export type ChatMessageRequest = {
	token: string;
	message: ChatMessage;
};

export type NewChatMessagePayload = {
	message: ChatMessage;
	user: User;
};

export type NewExamReturnPayload = {
	examReturnMessage: ChatMessage;
};

export type MessagesApiResponse = {
	messages: ChatMessage[];
	systemMessages: ChatMessage[];
	availableBefore: number;
	users: User[];
};

export type SingleMessageApiResponse = {
	message: ChatMessage;
	user: User;
	usersWhoLiked: User[];
};

export type UsernameChangedPayload = {
	user: User;
	uni_identifier: string;
	university: Institution;
	oldUsername: string;
};

export type ProfilePictureChanged = {
	avatar: string;
	userId: string;
};

export type ProfilePictureRemoved = {
	userId: string;
};

export type DeleteMessageRequest = {
	token: string;
	messageId: string;
};

type ReportReason =
	| 'spam'
	| 'inappropriate'
	| 'sexual-content'
	| 'prohibited-content'
	| 'harassment'
	| 'offensive'
	| 'other';

type MessageDeletedReason = 'author-removed' | 'admin-removed' | ReportReason;

export type ReportMessageRequest = {
	token: string;
	messageId: string;
	reason: ReportReason;
};

export type ReportMessageResponse = {
	messageId: string;
};

export type MessageDeletedPayload = {
	messageID: string;
	reason: MessageDeletedReason;
	other_reason?: string;
};

export type SubscribeToChannelPayload = {
	channelId: string;
	userId: string;
};

export type OnlineUsersPayload = {
	channelId: string;
	userCount: number;
	usersWithNotificationsEnabled: number;
};

export enum SocketChatMessageTypes {
	SEND_CHAT_MESSAGE = 'SEND_CHAT_MESSAGE',
	ACKNOWLEDGE_CHAT_MESSAGE = 'ACKNOWLEDGE_CHAT_MESSAGE',
	NEW_CHAT_MESSAGE = 'NEW_CHAT_MESSAGE',
	SUBSCRIBE_TO_CHANNEL = 'SUBSCRIBE_TO_CHANNEL',
	UNSUBSCRIBE_FROM_CHANNEL = 'UNSUBSCRIBE_FROM_CHANNEL',
	USERNAME_HAS_CHANGED = 'USERNAME_HAS_CHANGED',
	NEW_EXAM_RETURN = 'NEW_EXAM_RETURN',
	DELETE_MESSAGE_REQUEST = 'DELETE_MESSAGE_REQUEST',
	MESSAGE_DELETED = 'MESSAGE_DELETED',
	STARTED_TYPING = 'STARTED_TYPING',
	STOPPED_TYPING = 'STOPPED_TYPING',
	USER_IS_TYPING = 'USER_IS_TYPING',
	USER_STOPPED_TYPING = 'USER_STOPPED_TYPING',
	ACTIVE_USER_COUNT = 'ACTIVE_USER_COUNT',
	REPORT_MESSAGE = 'REPORT_MESSAGE',
	REPORT_MESSAGE_CONFIRMED = 'REPORT_MESSAGE_CONFIRMED',
	LIKE_MESSAGE = 'LIKE_MESSAGE',
	MESSAGE_LIKED = 'MESSAGE_LIKED',
	UNLIKE_MESSAGE = 'UNLIKE_MESSAGE',
	MESSAGE_UNLIKED = 'MESSAGE_UNLIKED',
	PROFILE_PICTURE_CHANGED = 'PROFILE_PICTURE_CHANGED',
	PROFILE_PICTURE_REMOVED = 'PROFILE_PICTURE_REMOVED',
	SUBSCRIBE_ACCOUNT_CHANGE = 'SUBSCRIBE_ACCOUNT_CHANGE',
	ACCOUNT_CHANGE_SUBSCRIBED = 'ACCOUNT_CHANGE_SUBSCRIBED',
	NEW_NONCE = 'NEW_NONCE',
}

export enum SystemMessageType {
	USERNAME_CHANGE = 'USERNAME_CHANGE',
	EXAM_RETURNED = 'EXAM_RETURNED',
}

type UsernameChangedMetadata = {
	type: SystemMessageType.USERNAME_CHANGE;
	oldUsername: string;
	newUsername: string;
	userId: string;
};

type ExamReturnedMetadata = {
	type: SystemMessageType.EXAM_RETURNED;
	examReturn: ExpandedExamReturnStatistic;
};

export type UsernameAvailabilityReport = {
	available: boolean;
};

export type StartTypingPayload = {
	token: string;
	uni_identifier: string;
	university: Institution;
};

export type UserStartedTypingPayload = {
	uni_identifier: string;
	university: Institution;
	user: UserMinimalInfo;
};

export type StoppedTypingPayload = {
	token: string;
	uni_identifier: string;
	university: Institution;
};

export type UserStoppedTypingPayload = {
	uni_identifier: string;
	university: Institution;
	userId: string;
};

export type LikeMessagePayload = {
	token: string;
	messageId: string;
};

export type UnlikeMessagePayload = {
	token: string;
	messageId: string;
};

export type MessageLikedPayload = {
	messageId: string;
	user: User;
};

export type MessageUnlikedPayload = {
	messageId: string;
	userId: string;
};

export type SubscribeAccountChange = {
	token: string;
};

export type NewNonceNotification = {
	newNonce: number;
};

export const getAccountUpdatesChannelName = (token: string) => {
	return `account/${token}`;
};
