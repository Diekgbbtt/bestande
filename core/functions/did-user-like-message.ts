import {createSelector} from 'reselect';
import {AppState} from '../types/app-state';

export const didUserLikeMessage = createSelector(
	[
		(state: AppState) => state.users.userProfile,
		(state: AppState) => state.chatServer.likes,
		(state: AppState, messageId: string) => messageId,
	],
	(user, allLikes, messageId) => {
		return user
			? allLikes.find((l) => l.messageId === messageId && l.likedBy === user.id)
			: null;
	}
);

export const didLikeMessageButLikeIsUnsent = createSelector(
	[
		(state: AppState) => state.chatServer.unsentLikes,
		(state: AppState, messageId: string) => messageId,
	],
	(unsentLikes, messageId) => {
		return unsentLikes.find((l) => l === messageId);
	}
);

export const didUnlikeMessageButWasNotAcknowledged = createSelector(
	[
		(state: AppState) => state.chatServer.unsentUnlikes,
		(state: AppState, messageId: string) => messageId,
	],
	(unsentUnlinks, messageId) => {
		return unsentUnlinks.find((l) => l === messageId);
	}
);
