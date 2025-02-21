import {IMessageWithQuotes} from '../types/types';
import {User} from '../types/user-state';

export const addUserTagsToMessage = (
	msg: IMessageWithQuotes,
	users: User[]
): IMessageWithQuotes => {
	let newText = msg.text;
	for (const user of users) {
		if (newText.toLowerCase().includes(`@${user.username}`.toLowerCase())) {
			newText = newText.replace(
				new RegExp(`@${user.username}`, 'gi'),
				`[user:${user.id}]`
			);
		}
	}

	return {
		...msg,
		text: newText,
	};
};
