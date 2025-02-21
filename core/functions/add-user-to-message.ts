import {ChatMessage} from '../actions/chat-server';
import {IMessageWithQuotes} from '../types/types';
import {User} from '../types/user-state';
import {getImageUrl} from './get-image-url';

export const addUserToMessage = (
	message: ChatMessage,
	userPool: User[]
): IMessageWithQuotes['user'] => {
	if (message.system) {
		return {
			_id: 'system',
			verified: false,
		};
	}

	const user = userPool.find((u) => u.id === message.userId);
	if (!user) {
		return {
			_id: -1,
			avatar: undefined,
			name: '[Deleted]',
			verified: false,
		};
	}

	return {
		_id: user.id,
		avatar: user.avatar
			? getImageUrl({
					cdn_identifier: user.avatar,
					width: 80,
					height: 80,
					crop: null,
			  })
			: undefined,
		name: user.username,
		verified: Boolean(user.verified),
	};
};
