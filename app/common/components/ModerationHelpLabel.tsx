import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components';
import {getChatRoomIdentifier} from '../../../core/functions/get-chat-room-identifier';
import {useAppState} from '../../../core/functions/use-app-state';
import {IMessageWithQuotes} from '../../../core/types/types';
import {findChatMessageById} from '../api/find-chat-message-by-id';

const Container = styled(View)``;

const Tiny = styled(Text)`
	font-size: 10px;
	font-weight: bold;
	color: gray;
`;

export const ModerationHelpLabel = (props: {message: IMessageWithQuotes}) => {
	const chatMessage = useAppState((state) =>
		findChatMessageById(state, String(props.message._id))
	);
	if (!chatMessage) {
		return null;
	}

	return (
		<Container>
			<Tiny>
				{getChatRoomIdentifier(
					chatMessage.uni_identifier,
					chatMessage.university
				)}
			</Tiny>
		</Container>
	);
};
