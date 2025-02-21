import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {
	SocketChatMessageTypes,
	SubscribeToChannelPayload,
} from '../actions/chat-server';
import {fetchPreviousMessages} from '../actions/chat-server-native';
import {getChatRoomIdentifier} from '../functions/get-chat-room-identifier';
import {getUserHash} from '../functions/get-user-hash';
import {useAppState} from '../functions/use-app-state';
import {Institution} from '../models/credit';

type Props = {
	university: Institution | null;
	uni_identifier: string;
};

export const ChatRoomSubscription = (props: Props) => {
	const chatInstance = useAppState((state) => state.chatServer.chatInstance);
	const connected = useAppState((state) => state.chatServer.connected);
	const userHash = useAppState((state) => getUserHash(state, null));
	const dispatch = useDispatch();

	useEffect(() => {
		// Only subscribe to channel when we (re-)connect
		if (!chatInstance) {
			return () => {
				// noop
			};
		}

		// Get chat room identifier
		const chatRoom = getChatRoomIdentifier(
			props.uni_identifier,
			props.university
		);

		const subscribePayload: SubscribeToChannelPayload = {
			channelId: chatRoom,
			userId: userHash,
		};

		// Subscribe to channel
		chatInstance.emit(
			SocketChatMessageTypes.SUBSCRIBE_TO_CHANNEL,
			subscribePayload
		);

		// Unsubscribe as soon as this component gets unmounted
		return () => {
			if (chatInstance.connected) {
				chatInstance.emit(
					SocketChatMessageTypes.UNSUBSCRIBE_FROM_CHANNEL,
					chatRoom
				);
			}
		};
	}, [chatInstance, props.university, props.uni_identifier, userHash]);

	useEffect(() => {
		if (connected) {
			dispatch(
				fetchPreviousMessages(
					props.uni_identifier,
					props.university,
					30,
					Date.now(),
					true
				)
			);
		}
	}, [connected, props.uni_identifier, props.university, dispatch]);

	// Render nothing
	return null;
};
