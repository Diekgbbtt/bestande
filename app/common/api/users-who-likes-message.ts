import {createSelector} from 'reselect';
import {getUserPool} from '../../../core/functions/get-user-pool';
import {truthy} from '../../../core/functions/truthy';
import {AppState} from '../../../core/types/app-state';

export const usersWhoLikesMessage = createSelector(
	[
		(state: AppState) => state.chatServer.likes,
		getUserPool,
		(state: AppState, messageId: string) => messageId,
	],
	(likes, users, messageId) => {
		const likesForThisMessage = likes.filter((l) => l.messageId === messageId);
		const usersWhoLiked = likesForThisMessage
			.map((l) => users.find((u) => u.id === l.likedBy))
			.filter(truthy);
		return usersWhoLiked;
	}
);
