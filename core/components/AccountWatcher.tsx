import {useCallback, useEffect} from 'react';
import {SocketChatMessageTypes} from '../actions/chat-server';
import {getUserHash} from '../functions/get-user-hash';
import {useAppState} from '../functions/use-app-state';

export const AccountWatcher = () => {
	const chatInstance = useAppState((state) => state.chatServer.chatInstance);
	const profile = useAppState((state) => state.users.userProfile);
	const token = useAppState((s) => getUserHash(s, null));

	const onSubscribed = useCallback(() => {
		console.log('subscribed to account changes');
	}, []);

	useEffect(() => {
		if (!chatInstance || !profile) {
			return;
		}

		chatInstance.on(
			SocketChatMessageTypes.ACCOUNT_CHANGE_SUBSCRIBED,
			onSubscribed
		);
		chatInstance.emit(SocketChatMessageTypes.SUBSCRIBE_ACCOUNT_CHANGE, {
			token,
		});
		return () => {
			chatInstance.off(
				SocketChatMessageTypes.ACCOUNT_CHANGE_SUBSCRIBED,
				onSubscribed
			);
		};
	}, [chatInstance, onSubscribed, profile, token]);

	return null;
};
