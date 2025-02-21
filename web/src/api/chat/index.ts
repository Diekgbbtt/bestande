import {Router} from 'express';
import {Server} from 'http'; // eslint-disable-line
import createHttpError from 'http-errors';
import first from 'lodash/first';
import flatten from 'lodash/flatten';
import last from 'lodash/last';
import pickBy from 'lodash/pickBy';
import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import ms from 'ms';
import Slackbot from 'slackbot';
import socketio from 'socket.io';
import {v4 as uuid} from 'uuid';
import {
	ChatMessage,
	ChatMessageRequest,
	DeleteMessageRequest,
	getAccountUpdatesChannelName,
	likeMessage,
	LikeMessagePayload,
	MessageDeletedPayload,
	MessageLikedPayload,
	MessagesApiResponse,
	MessageUnlikedPayload,
	OnlineUsersPayload,
	ProfilePictureChanged,
	ProfilePictureRemoved,
	ReportMessageRequest,
	ReportMessageResponse,
	SingleMessageApiResponse,
	SocketChatMessageTypes,
	StartTypingPayload,
	StoppedTypingPayload,
	SubscribeAccountChange,
	SubscribeToChannelPayload,
	unlikeMessage,
	UnlikeMessagePayload,
	UsernameAvailabilityReport,
	UsernameChangedPayload,
	UserStartedTypingPayload,
	UserStoppedTypingPayload,
} from '../../../../core/actions/chat-server';
import {
	DatabaseUser,
	GetProfileRequest,
	SetUsernamePayload,
} from '../../../../core/actions/users';
import {canChangeUsername} from '../../../../core/functions/can-change-username';
import {expandExamReturn} from '../../../../core/functions/expand-exam-return';
import {getChatRoomIdentifier} from '../../../../core/functions/get-chat-room-identifier';
import {isUsernameValid} from '../../../../core/functions/is-username-valid';
import {makeExamReturnMessage} from '../../../../core/functions/make-exam-return-message';
import {Institution} from '../../../../core/models/credit';
import rawStrings from '../../../../core/raw-strings';
import {NotificationSettings} from '../../../../core/types/notifications-state';
import {
	LastMessagesResponse,
	ModuleIdAndName,
} from '../../../../core/types/types';
import {User} from '../../../../core/types/user-state';
import {
	examReturnsCollection,
	messagesCollection,
	moduleCollection,
	userCollection,
} from '../../db/collections';
import {asyncHandler} from '../../handlers';
import {broadcastTo} from '../../helpers/broadcast-to';
import {databaseUserToUser} from '../../helpers/database-user-to-user';
import {sendAndroidPushNotification} from '../../helpers/send-android-push-notification';
//import {sendIosPushNotification} from '../../helpers/send-ios-push-notification';
import {triggerVideo} from '../../helpers/trigger-video';
import {bannedUsers} from './banned-users';
import {getActiveUsersNoInLastHour, registerUserLoggedIn} from './online-users';
import {postChatMessage} from './post-chat-message';

export const router = Router();

const slackbot = process.env.SLACK_TOKEN
	? new Slackbot('hackercompany', process.env.SLACK_TOKEN)
	: null;

let io: socketio.Server | null = null;

export const getIoServer = (): socketio.Server => {
	if (!io) {
		throw new Error('cannot get server');
	}

	return io;
};

router.get(
	'/messages/:id',
	asyncHandler<
		{
			params: {
				id: string;
			};
		},
		SingleMessageApiResponse
	>(
		async (request): Promise<SingleMessageApiResponse> => {
			const message = await messagesCollection().findOne({
				_id: request.params.id,
			});
			if (!message) {
				throw createHttpError(404, 'Message not found');
			}

			const user = await userCollection().findOne({
				id: message.userId,
			});
			if (!user) {
				throw createHttpError(404, 'User not found');
			}

			const usersWhoLiked = message.likes?.length
				? await userCollection()
						.find({
							id: {$in: message.likes},
						})
						.toArray()
				: [];
			return {
				message,
				usersWhoLiked: usersWhoLiked.map((u) => databaseUserToUser(u)),
				user: databaseUserToUser(user),
			};
		}
	)
);

router.get(
	'/last-messages',
	asyncHandler(
		async (): Promise<LastMessagesResponse> => {
			const messages = await messagesCollection()
				.find({
					createdAt: {$lt: Date.now() - ms('1h')},
				})
				.sort({
					createdAt: -1,
				})
				.limit(10)
				.toArray();
			const users = await userCollection()
				.find({
					id: {$in: messages.map((m) => m.userId)},
				})
				.toArray();
			// Dangerous query, might return too much, will filter out duplicates later
			const courses = (await moduleCollection()
				.find(
					{
						uni_identifier: {$in: messages.map((m) => m.uni_identifier)},
					},
					{
						projection: {
							uni_identifier: 1,
							university: 1,
							short_name: 1,
							ratingSummary: 1,
							userCount: 1,
						},
					}
				)
				.toArray()) as ModuleIdAndName[];

			return {
				messages,
				users: users.map((d) => databaseUserToUser(d)),
				courses: courses.filter((c) =>
					messages.find(
						(m) =>
							m.uni_identifier === c.uni_identifier &&
							m.university === c.university
					)
				),
			};
		}
	)
);

router.get(
	'/messages',
	asyncHandler<
		{
			query: {
				limit: number;
				before: number;
				uni_identifier: string;
				university: Institution;
			};
		},
		{messages: ChatMessage[]; systemMessages: ChatMessage[]}
	>(
		async (request): Promise<MessagesApiResponse> => {
			const gradeReturnExtraOut = ms('1m');
			let limit = Number(request.query.limit);
			if (isNaN(limit)) {
				throw createHttpError(400, 'Limit must be a number');
			}

			limit = Math.min(limit, 100);
			const before = Number(request.query.before);
			if (isNaN(before)) {
				throw createHttpError(400, 'Before must be a number');
			}

			if (before > Date.now() + 60 * 1000) {
				throw createHttpError(400, 'Before must be before now');
			}

			const uni_identifier =
				request.query.uni_identifier === 'all'
					? undefined
					: request.query.uni_identifier;
			const university =
				request.query.uni_identifier === 'all'
					? undefined
					: request.query.university;

			const cursor = messagesCollection()
				.find(
					pickBy({
						uni_identifier,
						university,
						// Specifically less than, not less than or equal
						createdAt: {$lt: before},
					})
				)
				.sort({createdAt: -1});
			const [count, messages, examReturns] = await Promise.all([
				cursor.count(),
				cursor.limit(limit).toArray(),
				examReturnsCollection()
					.find({
						uni_identifier,
						university,
					})
					.toArray(),
			]);
			const userIds = uniq([
				...(messages as ChatMessage[]).map((m) => m.userId),
				...flatten((messages as ChatMessage[]).map((m) => m.likes || [])),
			]);
			const users: DatabaseUser[] = await userCollection()
				.find({
					id: {
						$in: userIds,
					},
				})
				.toArray();
			const availableBefore = count - messages.length;
			const sortedMessages = sortBy(
				messages as ChatMessage[],
				(m) => m.createdAt
			);
			const examReturnsInRange = examReturns.filter((examReturn) => {
				const firstCreated = first(sortedMessages)?.createdAt;
				const lastCreated = last(sortedMessages)?.createdAt;
				if (!firstCreated || !lastCreated || sortedMessages.length < 2) {
					return true;
				}

				if (
					examReturn.return_date > lastCreated &&
					examReturn.return_date < before
				) {
					return true;
				}

				return (
					examReturn.return_date + gradeReturnExtraOut >= firstCreated &&
					examReturn.return_date <= lastCreated
				);
			});

			const expandedExamReturnStatistics = await Promise.all(
				examReturnsInRange.map(expandExamReturn)
			);
			return {
				messages,
				availableBefore,
				systemMessages: expandedExamReturnStatistics.map(
					(examReturn): ChatMessage => {
						return makeExamReturnMessage(examReturn);
					}
				),
				users: users.map((u) => databaseUserToUser(u)),
			};
		}
	)
);

router.post(
	'/profile',
	asyncHandler<{body: GetProfileRequest}, User>(async (request) => {
		const {token, appVersion, language} = request.body;
		const existingUser = await userCollection().findOne({
			token,
		});
		if (!existingUser) {
			throw createHttpError(404, 'User not found');
		}

		if (
			existingUser.latestAppVersion !== appVersion ||
			existingUser.preferredLanguage !== language
		) {
			await userCollection().updateOne(
				{
					id: existingUser.id,
				},
				{
					$set: {
						latestAppVersion: appVersion,
						preferredLanguage: language,
					},
				}
			);
		}

		return databaseUserToUser(existingUser);
	})
);

router.post(
	'/notification-settings',
	asyncHandler<{body: {token: string}}, NotificationSettings | undefined>(
		async (request, response) => {
			const {token} = request.body;
			const existingUser = await userCollection().findOne({
				token,
			});
			if (!existingUser) {
				// Manually do this to prevent papertrail spamming
				response.status(404).json({
					success: false,
					error: 'User not found',
				});
				return;
			}

			if (!existingUser.pushSubscriptions) {
				existingUser.pushSubscriptions = [];
			}

			if (!existingUser.devices) {
				existingUser.devices = [];
			}

			return {
				pushSubscriptions: existingUser.pushSubscriptions,
				devices: existingUser.devices,
			};
		}
	)
);

const isUsernameAvailable = (username: string) => {
	return userCollection().findOne({
		username: new RegExp(['^', username, '$'].join(''), 'i'),
	});
};

router.get(
	'/username-availability',
	asyncHandler<{query: {username: string}}, UsernameAvailabilityReport>(
		async (request) => {
			const {username} = request.query;
			const existingUser = await isUsernameAvailable(username);
			if (existingUser) {
				return {
					available: false,
				};
			}

			return {
				available: true,
			};
		}
	)
);

router.post(
	'/report',
	asyncHandler<{body: ReportMessageRequest}, ReportMessageResponse>(
		async (request) => {
			const user = await userCollection().findOne({
				token: request.body.token,
			});
			if (!user) {
				console.log('Could not find user, skipping');
				throw createHttpError('Could not find user');
			}

			const message = await messagesCollection().findOne({
				_id: request.body.messageId,
			});
			if (!message) {
				console.log('Could not find message, skipping');
				throw createHttpError('Could not find message');
			}

			const offender = await userCollection().findOne({
				id: message.userId,
			});
			if (!offender) {
				console.log('Could not find offender');
				throw createHttpError('Could not find offender');
			}

			if (user && user.id === message.userId) {
				console.log(
					'Found someone trying to report their own message, ignoring',
					request
				);
				throw createHttpError(400, 'Cannot ignore own chat message');
			}

			slackbot.send(
				'#bestande-reports',
				[
					`Report by user ${user.username}`,
					'messageID ' + request.body.messageId,
					'reason ' + request.body.reason,
					'message text \n > ' + message.text,
					'offender: ' + offender.username,
				].join('\n')
			);

			const confirmationPayload: ReportMessageResponse = {
				messageId: request.body.messageId,
			};
			return confirmationPayload;
		}
	)
);

router.delete(
	'/profile-picture',
	asyncHandler<
		{
			body: {
				token: string;
			};
		},
		{}
	>(async (request) => {
		const {token} = request.body;

		const existingUser = await userCollection().findOne({
			token,
		});

		if (!existingUser) {
			throw createHttpError(404, 'User not found');
		}

		await userCollection().updateOne(
			{
				token,
			},
			{
				$unset: {
					avatar: 1,
				},
			}
		);

		const channelsOfUser = await messagesCollection()
			.find(
				{
					userId: existingUser.id,
				},
				{
					projection: {
						uni_identifier: 1,
						university: 1,
					},
				}
			)
			.toArray();

		const uniqueChannels = uniqBy(channelsOfUser as ChatMessage[], (c) =>
			getChatRoomIdentifier(c.uni_identifier, c.university)
		);

		for (const channel of uniqueChannels) {
			const payload: ProfilePictureRemoved = {
				userId: existingUser.id,
			};
			broadcastTo(
				io as socketio.Server,
				getChatRoomIdentifier(channel.uni_identifier, channel.university),
				SocketChatMessageTypes.PROFILE_PICTURE_REMOVED,
				payload
			);
		}

		return {};
	})
);

router.post(
	'/profile-picture',
	asyncHandler<
		{
			body: {
				token: string;
				image: string;
			};
		},
		{
			avatar: string;
		}
	>(async (request) => {
		const {token, image} = request.body;
		if (typeof image !== 'string') {
			throw createHttpError(400, '`image` should be a string');
		}

		const existingUser = await userCollection().findOne({
			token,
		});
		if (!existingUser) {
			throw createHttpError(404, 'User not found');
		}

		await userCollection().updateOne(
			{
				token,
			},
			{
				$set: {
					avatar: request.body.image,
				},
			}
		);

		const channelsOfUser = await messagesCollection()
			.find(
				{
					userId: existingUser.id,
				},
				{
					projection: {
						uni_identifier: 1,
						university: 1,
					},
				}
			)
			.toArray();

		const uniqueChannels = uniqBy(channelsOfUser as ChatMessage[], (c) =>
			getChatRoomIdentifier(c.uni_identifier, c.university)
		);

		for (const channel of uniqueChannels) {
			const payload: ProfilePictureChanged = {
				avatar: request.body.image,
				userId: existingUser.id,
			};
			broadcastTo(
				io as socketio.Server,
				getChatRoomIdentifier(channel.uni_identifier, channel.university),
				SocketChatMessageTypes.PROFILE_PICTURE_CHANGED,
				payload
			);
		}

		return {
			avatar: request.body.image,
		};
	})
);

router.post(
	'/username',
	asyncHandler<{body: SetUsernamePayload}, User>(async (request) => {
		const {token, username} = request.body;
		const err = isUsernameValid(username, null, 'en');
		if (err) {
			throw createHttpError(400, err);
		}

		const taken = await isUsernameAvailable(username);
		if (taken) {
			throw createHttpError(400, 'Username is not available');
		}

		const existingUser = await userCollection().findOne({
			token,
		});
		const date = Date.now();
		let result: User | null = null;
		if (existingUser) {
			if (existingUser.username === username) {
				throw createHttpError(400, 'This is already your username');
			}

			if (!canChangeUsername(existingUser)) {
				throw createHttpError(403, 'Can only change username every 12 hours');
			}

			const $set = {
				username,
				lastUsernameChange: date,
				latestAppVersion: request.body.appVersion,
			};
			await userCollection().updateOne(
				{
					token,
				},
				{
					$set,
				}
			);
			result = databaseUserToUser({
				...existingUser,
				...$set,
			});
		} else {
			const dbUser: DatabaseUser = {
				admin: false,
				token,
				username,
				lastUsernameChange: 0,
				joined: date,
				avatar: null,
				id: uuid(),
				devices: [],
				pushSubscriptions: [],
				latestAppVersion: request.body.appVersion,
				preferredLanguage: request.body.language,
				moduleCollectionNonce: 0,
			};
			await userCollection().insertOne(dbUser);
			result = databaseUserToUser(dbUser);
		}

		const channelsOfUser = await messagesCollection()
			.find(
				{
					userId: result.id,
				},
				{
					projection: {
						uni_identifier: 1,
						university: 1,
					},
				}
			)
			.toArray();

		const uniqueChannels = uniqBy(channelsOfUser as ChatMessage[], (c) =>
			getChatRoomIdentifier(c.uni_identifier, c.university)
		);

		for (const channel of uniqueChannels) {
			const payload: UsernameChangedPayload = {
				user: result,
				uni_identifier: channel.uni_identifier,
				university: channel.university,
				oldUsername: existingUser?.username as string,
			};
			broadcastTo(
				io as socketio.Server,
				getChatRoomIdentifier(channel.uni_identifier, channel.university),
				SocketChatMessageTypes.USERNAME_HAS_CHANGED,
				payload
			);
		}

		return result;
	})
);

export const chat = (app: Server) => {
	io = socketio(app);

	io.on('connection', (socket) => {
		console.log('new connection');
		socket.on('disconnect', () => {
			console.log('a socket disconnected');
		});

		socket.on(
			SocketChatMessageTypes.SUBSCRIBE_ACCOUNT_CHANGE,
			async (payload: SubscribeAccountChange) => {
				const user = await userCollection().findOne({
					token: payload.token,
				});
				if (!user) {
					console.log(
						'Found unauthenticated unlike request with token',
						payload.token
					);
					return;
				}

				await new Promise<void>((resolve, reject) => {
					socket.join(getAccountUpdatesChannelName(payload.token), (err) => {
						if (err) {
							reject(err);
						} else {
							resolve();
						}
					});
				});
				socket.emit(SocketChatMessageTypes.ACCOUNT_CHANGE_SUBSCRIBED);
			}
		);

		socket.on(
			SocketChatMessageTypes.UNLIKE_MESSAGE,
			async (payload: UnlikeMessagePayload) => {
				const user = await userCollection().findOne({
					token: payload.token,
				});
				if (!user) {
					console.log(
						'Found unauthenticated unlike request with token',
						payload.token
					);
					return;
				}

				const message = await messagesCollection().findOne({
					_id: payload.messageId,
				});
				if (!message) {
					console.log(
						'Tried to unlike message but it did not exist',
						payload.messageId
					);
					return;
				}

				const unlikedMessage = unlikeMessage(message, user.id);
				await messagesCollection().updateOne(
					{
						_id: unlikedMessage._id,
					},
					{
						$set: {
							likes: unlikedMessage.likes,
						},
					}
				);
				const response: MessageUnlikedPayload = {
					messageId: unlikedMessage._id,
					userId: user.id,
				};
				const roomIdentifier = getChatRoomIdentifier(
					message.uni_identifier,
					message.university
				);
				broadcastTo(
					io as socketio.Server,
					roomIdentifier,
					SocketChatMessageTypes.MESSAGE_UNLIKED,
					response
				);
				console.log('message unliked');
			}
		);

		socket.on(
			SocketChatMessageTypes.LIKE_MESSAGE,
			async (payload: LikeMessagePayload) => {
				const user = await userCollection().findOne({
					token: payload.token,
				});
				if (!user) {
					console.log(
						'Found unauthenticated like request with token',
						payload.token
					);
					return;
				}

				if (bannedUsers.includes(user.id)) {
					return;
				}

				const message = await messagesCollection().findOne({
					_id: payload.messageId,
				});
				if (!message) {
					console.log(
						'Tried to like message but it did not exist',
						payload.messageId
					);
					return;
				}

				const likedMessage = likeMessage(message, user.id);
				await messagesCollection().updateOne(
					{
						_id: likedMessage._id,
					},
					{
						$set: {
							likes: likedMessage.likes,
						},
					}
				);

				const mod = await moduleCollection().findOne(
					{
						university: likedMessage.university,
						uni_identifier: likedMessage.uni_identifier,
					},
					{projection: {short_name: 1, university: 1, uni_identifier: 1}}
				);
				if (!mod) {
					console.log('Could not fetch module info, not sending notification');
					return;
				}

				const response: MessageLikedPayload = {
					messageId: likedMessage._id,
					user: databaseUserToUser(user),
				};
				const roomIdentifier = getChatRoomIdentifier(
					message.uni_identifier,
					message.university
				);

				const userWhoGotLiked = (await userCollection().findOne({
					id: likedMessage.userId,
				})) as DatabaseUser;
				if (
					userWhoGotLiked?.devices &&
					userWhoGotLiked?.pushSubscriptions.includes(roomIdentifier)
				) {
					for (const device of userWhoGotLiked.devices) {
						const title = mod.short_name as string;
						const notificationBody = `${user.username} ${
							rawStrings.LIKES_YOUR_MESSAGE[
								userWhoGotLiked.preferredLanguage || 'de'
							]
						}`;
						// if (device.platform === 'ios') {
						// 	try {
						// 		await sendIosPushNotification({
						// 			deviceToken: device.notificationToken,
						// 			channel: roomIdentifier,
						// 			title,
						// 			subtitle: notificationBody,
						// 			uni_identifier: mod.uni_identifier,
						// 			university: mod.university,
						// 		});
						// 	} catch (err) {
						// 		console.log(
						// 			'error sending push notification to',
						// 			device.notificationToken,
						// 			err
						// 		);
						// 	}
						// } else if (device.platform === 'android') {
						// 	try {
						// 		await sendAndroidPushNotification({
						// 			deviceToken: device.notificationToken,
						// 			uni_identifier: mod.uni_identifier,
						// 			university: mod.university,
						// 			title,
						// 			subtitle: notificationBody,
						// 			short_name: mod.short_name as string,
						// 		});
						// 	} catch (err) {
						// 		console.log(
						// 			'error sending push notification to',
						// 			device.notificationToken,
						// 			err
						// 		);
						// 	}
						// }
					}
				}

				broadcastTo(
					io as socketio.Server,
					roomIdentifier,
					SocketChatMessageTypes.MESSAGE_LIKED,
					response
				);
			}
		);

		socket.on(
			SocketChatMessageTypes.SEND_CHAT_MESSAGE,
			async (newMessage: ChatMessageRequest) => {
				postChatMessage(newMessage);
			}
		);

		socket.on(
			SocketChatMessageTypes.SUBSCRIBE_TO_CHANNEL,
			(payload: SubscribeToChannelPayload) => {
				socket.join(payload.channelId, async (err) => {
					registerUserLoggedIn(payload.channelId, payload.userId);
					const userCount = getActiveUsersNoInLastHour(payload.channelId);
					const usersWithNotificationsEnabled = await userCollection().countDocuments(
						{
							pushSubscriptions: payload.channelId,
						}
					);
					const activeUsersPayload: OnlineUsersPayload = {
						channelId: payload.channelId,
						userCount,
						usersWithNotificationsEnabled,
					};
					socket.emit(
						SocketChatMessageTypes.ACTIVE_USER_COUNT,
						activeUsersPayload
					);
					console.log('Joined the room', payload.channelId, err);
				});
			}
		);

		socket.on(
			SocketChatMessageTypes.UNSUBSCRIBE_FROM_CHANNEL,
			(channelId: string) => {
				socket.leave(channelId, (err) => {
					console.log('Left the room', channelId, err);
				});
			}
		);

		socket.on(
			SocketChatMessageTypes.DELETE_MESSAGE_REQUEST,
			async (request: DeleteMessageRequest) => {
				const user = await userCollection().findOne({
					token: request.token,
				});
				const message = await messagesCollection().findOne({
					_id: request.messageId,
				});
				if (!user) {
					console.log(
						'Found unauthenticated request with token',
						request.token
					);
					return;
				}

				if (!message) {
					console.log('tried to delete message which was not found');
					return;
				}

				if (user.id !== message.userId && !user.admin) {
					console.log(
						'Someone unauthorized tried to delete a message, ignoring it',
						request
					);
					return;
				}

				await messagesCollection().deleteOne({
					_id: request.messageId,
				});

				const responsePayload: MessageDeletedPayload = {
					messageID: request.messageId,
					reason:
						user.id === message.userId
							? 'author-removed'
							: user.admin
							? 'admin-removed'
							: 'other',
				};

				broadcastTo(
					io as socketio.Server,
					getChatRoomIdentifier(message.uni_identifier, message.university),
					SocketChatMessageTypes.MESSAGE_DELETED,
					responsePayload
				);

				console.log('wants to delete a message');
			}
		);

		socket.on(
			SocketChatMessageTypes.STARTED_TYPING,
			async (payload: StartTypingPayload) => {
				const user = await userCollection().findOne({
					token: payload.token,
				});
				if (!user) {
					console.log(
						'Found unauthenticated request with token START_TYPING',
						payload.token
					);
					return;
				}

				const userStartedTypingPayload: UserStartedTypingPayload = {
					user: {
						id: user.id,
						username: user.username,
					},
					uni_identifier: payload.uni_identifier,
					university: payload.university,
				};
				broadcastTo(
					io as socketio.Server,
					getChatRoomIdentifier(payload.uni_identifier, payload.university),
					SocketChatMessageTypes.USER_IS_TYPING,
					userStartedTypingPayload
				);
			}
		);
		socket.on(
			SocketChatMessageTypes.STOPPED_TYPING,
			async (payload: StoppedTypingPayload) => {
				const user = await userCollection().findOne({
					token: payload.token,
				});
				if (!user) {
					console.log(
						'Found unauthenticated request with token STOPPED_TYPING',
						payload.token
					);
					return;
				}

				const userStoppedTypingPayload: UserStoppedTypingPayload = {
					userId: user.id,
					uni_identifier: payload.uni_identifier,
					university: payload.university,
				};
				broadcastTo(
					io as socketio.Server,
					getChatRoomIdentifier(payload.uni_identifier, payload.university),
					SocketChatMessageTypes.USER_STOPPED_TYPING,
					userStoppedTypingPayload
				);
			}
		);
	});

	io.on('message', (message) => {
		console.log('received message', message);
	});

	io.on('error', (error) => {
		console.log('received error', error);
	});
};

router.post(
	'/video',
	asyncHandler<
		{
			body: {
				messageIds: string[];
				token: string;
			};
		},
		{}
	>(async (request) => {
		const user = await userCollection().findOne({
			token: request.body.token,
		});
		if (!user || !user.admin) {
			throw createHttpError(403, 'Only admins can invoke this');
		}

		await triggerVideo(request.body.messageIds);
		return {};
	})
);
