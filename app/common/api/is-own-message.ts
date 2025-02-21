import {AppState} from '../../../core/types/app-state';
import {IMessageWithQuotes} from '../../../core/types/types';

export const isOwnMessage = (state: AppState, message: IMessageWithQuotes) => {
	return (
		state.users.userProfile && state.users.userProfile?.id === message.user._id
	);
};
