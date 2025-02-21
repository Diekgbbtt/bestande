import io from '@jonny/socket.io-client';
import ms from 'ms';
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {batchActions} from 'redux-batched-actions';
import {v4 as uuid} from 'uuid';
import {
	ChatMessage,
	LikeMessagePayload,
	MessageDeletedPayload,
	MessageLikedPayload,
	MessageUnlikedPayload,
	NewChatMessagePayload,
	NewExamReturnPayload,
	OnlineUsersPayload,
	ProfilePictureChanged,
	ProfilePictureRemoved,
	SocketChatMessageTypes,
	SystemMessageType,
	UsernameChangedPayload,
	UserStartedTypingPayload,
	UserStoppedTypingPayload,
} from '../actions/chat-server';
import {loadUserProfile} from '../actions/users-native';
import {getUserHash} from '../functions/get-user-hash';
import {hasGodmodeAccess} from '../functions/has-godmode-access';
import {useActiveState} from '../functions/use-active-state';
import {useAppState} from '../functions/use-app-state';
import {useLanguage} from '../functions/use-language';
import {WS_DOMAIN} from '../models/domain';
import {
	cancelTypingIndicators,
	chatserverConnected,
	chatServerDisconnected,
	likeAcknowledged,
	messageDeleted,
	messageSendAcknowledged,
	newMessageReceived,
	newSystemMessage,
	receiveActiveUsersCount,
	receiveMessageLike,
	receiveMessageUnlike,
	userStartedTyping,
	userStoppedTyping,
} from '../reducers/chat-server';
import {avatarChanged, avatarRemoved, setUserProfiles} from '../reducers/users';
import {ChatRoomSubscription} from './ChatRoomSubscription';

export const ChatServerManager = () => {
	const [
		sentButUnacknowledgedMessages,
		setSentButUnacknowledgedMessages,
	] = useState<ChatMessage[]>([]);
	const connected = useAppState((state) => state.chatServer.connected);
	const unsentMessages = useAppState(
		(state) => state.chatServer.unsentMessages
	);
	const unsentLikes = useAppState((state) => state.chatServer.unsentLikes);
	const chatInstance = useAppState((state) => state.chatServer.chatInstance);
	const token = useAppState((state) => getUserHash(state, null));
	const dispatch = useDispatch();
	const typingIndicators = useAppState(
		(state) => state.chatServer.typingIndicators
	);
	const language = useLanguage();
	const active = useActiveState();

	const socket = React.useMemo(() => {
		return io(WS_DOMAIN, {
			transports: ['websocket'],
			autoConnect: false,
		});
	}, []);

	useEffect(() => {
		if (active === 'active' && !connected) {
			socket.open();
		} else if (active !== 'active' && connected) {
			socket.close();
		}
	}, [active, connected, socket]);

	useEffect(() => {
		socket.on('connect', () => {
			dispatch(chatserverConnected(socket));
		});
		socket.on('disconnect', () => {
			dispatch(chatServerDisconnected());
		});
		return () => socket.disconnect();
	}, [dispatch, socket]);

	useEffect(() => {
		dispatch(loadUserProfile(token, language));
	}, [dispatch, token, language]);

	useEffect(() => {
		if (!chatInstance) {
			return () => {
				// nocleanup
			};
		}

		const newMessageHandler = (payload: NewChatMessagePayload) => {
			// If is own message, set as acknowledged.
			const isUnacknowledged = sentButUnacknowledgedMessages.find(
				(sentButUnacknowledgedMessage) => {
					return sentButUnacknowledgedMessage._id === payload.message._id;
				}
			);
			const userProfileAction = setUserProfiles([payload.user]);
			if (isUnacknowledged) {
				dispatch(
					batchActions([
						userProfileAction,
						messageSendAcknowledged(payload.message._id),
					])
				);
				setSentButUnacknowledgedMessages(
					(prevSentButUnacknowledgedMessages) => {
						return prevSentButUnacknowledgedMessages.filter(
							(m) => m._id !== payload.message._id
						);
					}
				);
			} else {
				dispatch(
					batchActions([userProfileAction, newMessageReceived(payload.message)])
				);
			}
		};

		chatInstance.on(SocketChatMessageTypes.NEW_CHAT_MESSAGE, newMessageHandler);
		return () =>
			chatInstance.off(
				SocketChatMessageTypes.NEW_CHAT_MESSAGE,
				newMessageHandler
			);
	}, [sentButUnacknowledgedMessages, chatInstance, dispatch]);

	// Handle like events
	useEffect(() => {
		if (!chatInstance) {
			return () => {
				// nocleanup
			};
		}

		const newLikeHandler = (payload: MessageLikedPayload) => {
			const wasUnsent = unsentLikes.find((m) => m === payload.messageId);
			if (wasUnsent) {
				dispatch(likeAcknowledged(payload.messageId, payload.user.id));
			} else {
				dispatch(
					batchActions([
						setUserProfiles([payload.user]),
						receiveMessageLike(payload.messageId, payload.user),
					])
				);
			}
		};

		chatInstance.on(SocketChatMessageTypes.MESSAGE_LIKED, newLikeHandler);
		return () => {
			chatInstance.off(SocketChatMessageTypes.MESSAGE_LIKED, newLikeHandler);
		};
	}, [chatInstance, dispatch, unsentLikes]);

	// Handle unlike events
	useEffect(() => {
		if (!chatInstance) {
			return () => {
				// nocleanup
			};
		}

		const unlikeHandler = (payload: MessageUnlikedPayload) => {
			dispatch(receiveMessageUnlike(payload.messageId, payload.userId));
		};

		chatInstance.on(SocketChatMessageTypes.MESSAGE_UNLIKED, unlikeHandler);
		return () => {
			chatInstance.off(SocketChatMessageTypes.MESSAGE_UNLIKED, unlikeHandler);
		};
	}, [chatInstance, dispatch]);

	useEffect(() => {
		if (!connected || !chatInstance) {
			return;
		}

		for (const messageId of unsentLikes) {
			const likePayload: LikeMessagePayload = {
				messageId,
				token,
			};
			chatInstance.emit(SocketChatMessageTypes.LIKE_MESSAGE, likePayload);
		}
	}, [unsentLikes, chatInstance, connected, token]);

	// Fire chat messages that are not yet sent
	useEffect(() => {
		if (!connected || !chatInstance) {
			return;
		}

		for (const messageRequest of unsentMessages) {
			if (
				!sentButUnacknowledgedMessages.find(
					(unacknowledgedMessage) =>
						unacknowledgedMessage._id === messageRequest.message._id
				)
			) {
				chatInstance.emit(
					SocketChatMessageTypes.SEND_CHAT_MESSAGE,
					messageRequest
				);
				setSentButUnacknowledgedMessages((unacknowledged) => [
					...unacknowledged,
					messageRequest.message,
				]);
			}
		}
	}, [unsentMessages, connected, chatInstance, sentButUnacknowledgedMessages]);

	useEffect(() => {
		if (!chatInstance) {
			return () => {
				// nocleanup
			};
		}

		const onAvatarChange = (payload: ProfilePictureChanged) => {
			// This will only be triggered on OTHER people changing
			// their profile picture.. changing own profile picture is handled
			// through REST endpoint
			dispatch(avatarChanged(payload.userId, payload.avatar));
		};

		chatInstance.on(
			SocketChatMessageTypes.PROFILE_PICTURE_CHANGED,
			onAvatarChange
		);
		return () => {
			chatInstance.off(
				SocketChatMessageTypes.PROFILE_PICTURE_CHANGED,
				onAvatarChange
			);
		};
	}, [chatInstance, dispatch]);

	useEffect(() => {
		if (!chatInstance) {
			return () => {
				// nocleanup
			};
		}

		const onAvatarRemove = (payload: ProfilePictureRemoved) => {
			// This will only be triggered on OTHER people changing
			// their profile picture.. changing own profile picture is handled
			// through REST endpoint
			dispatch(avatarRemoved(payload.userId));
		};

		chatInstance.on(
			SocketChatMessageTypes.PROFILE_PICTURE_REMOVED,
			onAvatarRemove
		);
		return () => {
			chatInstance.off(
				SocketChatMessageTypes.PROFILE_PICTURE_REMOVED,
				onAvatarRemove
			);
		};
	}, [chatInstance, dispatch]);

	useEffect(() => {
		if (!chatInstance) {
			return () => {
				// nocleanup
			};
		}

		const onNewExamReturn = (payload: NewExamReturnPayload) => {
			dispatch(newSystemMessage(payload.examReturnMessage));
		};

		chatInstance.on(SocketChatMessageTypes.NEW_EXAM_RETURN, onNewExamReturn);
		return () =>
			chatInstance.off(SocketChatMessageTypes.NEW_EXAM_RETURN, onNewExamReturn);
	}, [chatInstance, dispatch]);

	// Listen to username changes
	useEffect(() => {
		if (!chatInstance) {
			return () => {
				// nocleanup
			};
		}

		const onNameChange = (payload: UsernameChangedPayload) => {
			dispatch(
				batchActions([
					setUserProfiles([payload.user]),
					newSystemMessage({
						text: 'change',
						createdAt: Date.now(),
						system: true,
						uni_identifier: payload.uni_identifier,
						university: payload.university,
						userId: '0',
						_id: uuid(),
						systemMessageMetadata: {
							type: SystemMessageType.USERNAME_CHANGE,
							oldUsername: payload.oldUsername,
							newUsername: payload.user.username,
							userId: payload.user.id,
						},
					}),
				])
			);
		};

		chatInstance.on(SocketChatMessageTypes.USERNAME_HAS_CHANGED, onNameChange);
		return () =>
			chatInstance.off(
				SocketChatMessageTypes.USERNAME_HAS_CHANGED,
				onNameChange
			);
	}, [chatInstance, dispatch]);

	// Listen to message deletions
	useEffect(() => {
		if (!chatInstance) {
			return () => {
				// nocleanup
			};
		}

		const onMessageDelete = (message: MessageDeletedPayload) => {
			dispatch(messageDeleted(message));
		};

		chatInstance.on(SocketChatMessageTypes.MESSAGE_DELETED, onMessageDelete);
		return () => {
			chatInstance.off(SocketChatMessageTypes.MESSAGE_DELETED, onMessageDelete);
		};
	}, [chatInstance, dispatch]);

	// Listen to typing indicators
	useEffect(() => {
		if (!chatInstance) {
			return () => {
				// nocleanup
			};
		}

		const onTyping = (message: UserStartedTypingPayload) => {
			dispatch(
				userStartedTyping(
					message.user,
					message.uni_identifier,
					message.university
				)
			);
		};

		chatInstance.on(SocketChatMessageTypes.USER_IS_TYPING, onTyping);
		return () => {
			chatInstance.off(SocketChatMessageTypes.USER_IS_TYPING, onTyping);
		};
	}, [chatInstance, dispatch]);

	// Listen to user counts
	useEffect(() => {
		if (!chatInstance) {
			return () => {
				// nocleanup
			};
		}

		const onActiveUserCount = (message: OnlineUsersPayload) => {
			dispatch(
				receiveActiveUsersCount(
					message.channelId,
					message.userCount,
					message.usersWithNotificationsEnabled
				)
			);
		};

		chatInstance.on(
			SocketChatMessageTypes.ACTIVE_USER_COUNT,
			onActiveUserCount
		);
		return () => {
			chatInstance.off(
				SocketChatMessageTypes.ACTIVE_USER_COUNT,
				onActiveUserCount
			);
		};
	}, [chatInstance, dispatch]);

	// Listen to typing indicators stopped
	useEffect(() => {
		if (!chatInstance) {
			return () => {
				// nocleanup
			};
		}

		const onStoppedTyping = (message: UserStoppedTypingPayload) => {
			dispatch(
				userStoppedTyping(
					message.userId,
					message.uni_identifier,
					message.university
				)
			);
		};

		chatInstance.on(
			SocketChatMessageTypes.USER_STOPPED_TYPING,
			onStoppedTyping
		);
		return () => {
			chatInstance.off(
				SocketChatMessageTypes.USER_STOPPED_TYPING,
				onStoppedTyping
			);
		};
	}, [chatInstance, dispatch]);

	// Periodically cancel type indicators
	useEffect(() => {
		const timeout = setInterval(() => {
			const timedOutTypingIndicators = typingIndicators.filter(
				(ti) => Date.now() - ti.time > ms('15s')
			);
			if (timedOutTypingIndicators.length > 0) {
				dispatch(
					cancelTypingIndicators(timedOutTypingIndicators.map((t) => t.id))
				);
			}
		}, 1000);
		return () => clearTimeout(timeout);
	}, [chatInstance, dispatch, typingIndicators]);

	const isGod = useAppState((state) => hasGodmodeAccess(state));

	return isGod ? (
		<ChatRoomSubscription key="all" university={null} uni_identifier="all" />
	) : null;
};
