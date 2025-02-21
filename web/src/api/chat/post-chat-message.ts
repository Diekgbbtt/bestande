import {getIoServer} from '.';
import {
	ChatMessageRequest,
	NewChatMessagePayload,
	SocketChatMessageTypes,
} from '../../../../core/actions/chat-server';
import {chatMessageWithOverride} from '../../../../core/functions/chat-message-with-override';
import {getChatRoomIdentifier} from '../../../../core/functions/get-chat-room-identifier';
import {
	messagesCollection,
	moduleCollection,
	userCollection,
} from '../../db/collections';
import {broadcastTo} from '../../helpers/broadcast-to';
import {databaseUserToUser} from '../../helpers/database-user-to-user';
import {bannedUsers} from './banned-users';
import {sendPushNotificationToChannel} from './send-push-notification-to-channel';

export const postChatMessage = async (newMessage: ChatMessageRequest) => {
	const roomIdentifier = getChatRoomIdentifier(
		newMessage.message.uni_identifier,
		newMessage.message.university
	);
	const user = await userCollection().findOne({
		token: newMessage.token,
	});
	if (!user) {
		console.log('Found unauthenticated request with token', newMessage.token);
		return;
	}

	if (
		newMessage.message.text.includes('avaaz.org') ||
		newMessage.message.text.includes('change.org') ||
		newMessage.message.text.includes(
			'docs.google.com/forms/d/e/1FAIpQLSeEZQJckKpQQqdymd-QBRhOQkybfwZm4_CQ-bpIKyKVuNniXQ/viewform'
		)
	) {
		return;
	}

	if (bannedUsers.includes(user.id)) {
		return;
	}

	await messagesCollection().insertOne({
		...newMessage.message,
		userId: user.id,
	});

	const payload: NewChatMessagePayload = {
		message: newMessage.message,
		user: databaseUserToUser(user),
	};
	broadcastTo(
		getIoServer(),
		roomIdentifier,
		SocketChatMessageTypes.NEW_CHAT_MESSAGE,
		payload
	);
	const mod = await moduleCollection().findOne(
		{
			university: newMessage.message.university,
			uni_identifier: newMessage.message.uni_identifier,
		},
		{projection: {short_name: 1, university: 1, uni_identifier: 1}}
	);
	if (!mod) {
		console.log('Could not fetch module info, doing nothing');
		return;
	}

	const text = chatMessageWithOverride(newMessage.message);

	sendPushNotificationToChannel({
		uni_identifier: mod.uni_identifier,
		university: mod.university,
		title: () => `${user.username} @ ${mod.short_name}`,
		text: () => text,
		short_name: mod.short_name as string,
	});
};
