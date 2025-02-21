import {transparentize} from 'polished';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Image} from 'react-native-normalized';
import {useDispatch} from 'react-redux';
import styled from 'styled-components';
import {
	SocketChatMessageTypes,
	UnlikeMessagePayload,
} from '../../../core/actions/chat-server';
import {Colors} from '../../../core/functions/Colors';
import {
	didLikeMessageButLikeIsUnsent,
	didUnlikeMessageButWasNotAcknowledged,
	didUserLikeMessage,
} from '../../../core/functions/did-user-like-message';
import {getUserHash} from '../../../core/functions/get-user-hash';
import {hapticFeedback} from '../../../core/functions/HapticFeedback';
import {useAppState} from '../../../core/functions/use-app-state';
import {useAppearance} from '../../../core/functions/use-appearance';
import {
	addToUnsentLikes,
	signalUnlike,
} from '../../../core/reducers/chat-server';

const HeartIcon = styled(Image)`
	width: 14px;
	height: 12px;
`;

const Container = styled(TouchableOpacity)`
	position: absolute;
	right: -11px;
	bottom: 3px;
	padding: 12px;
`;

export const MessageLikeButton = (props: {messageId: string}) => {
	const chatInstance = useAppState((state) => state.chatServer.chatInstance);
	const token = useAppState((state) => getUserHash(state, null));
	const appearance = useAppearance();
	const dispatch = useDispatch();

	const didUserLike = useAppState((state) =>
		didUserLikeMessage(state, props.messageId)
	);
	const didLikeButUnsent = useAppState((state) =>
		didLikeMessageButLikeIsUnsent(state, props.messageId)
	);
	const didUnlikeButNotAcknowledged = useAppState((state) =>
		didUnlikeMessageButWasNotAcknowledged(state, props.messageId)
	);

	const onPress = React.useCallback(() => {
		if (!chatInstance) {
			return;
		}

		if (didUserLike) {
			const unlikePayload: UnlikeMessagePayload = {
				messageId: props.messageId,
				token,
			};
			chatInstance.emit(SocketChatMessageTypes.UNLIKE_MESSAGE, unlikePayload);
			dispatch(signalUnlike(props.messageId));
		} else {
			dispatch(addToUnsentLikes(props.messageId));
			hapticFeedback('impact');
		}
	}, [chatInstance, didUserLike, dispatch, props.messageId, token]);

	return (
		<Container onPress={onPress}>
			<HeartIcon
				style={{
					tintColor: didUnlikeButNotAcknowledged
						? transparentize(0.4, appearance.ICON_TINT)
						: didUserLike
						? Colors.Red
						: didLikeButUnsent
						? transparentize(0.5, Colors.Red)
						: transparentize(0.4, appearance.ICON_TINT),
				}}
				source={
					didUnlikeButNotAcknowledged
						? require('../assets/heart-outline.png')
						: didUserLike
						? require('../assets/heart.png')
						: didLikeButUnsent
						? require('../assets/heart.png')
						: require('../assets/heart-outline.png')
				}
			/>
		</Container>
	);
};
