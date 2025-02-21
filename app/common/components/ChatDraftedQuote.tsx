import React, {useMemo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Image, Text} from 'react-native-normalized';
import ParsedText from 'react-native-parsed-text';
import {useDispatch} from 'react-redux';
import styled from 'styled-components';
import {chatMessageWithOverride} from '../../../core/functions/chat-message-with-override';
import {getChatRoomIdentifier} from '../../../core/functions/get-chat-room-identifier';
import {getUserPool} from '../../../core/functions/get-user-pool';
import {parsePatterns} from '../../../core/functions/parse-patterns';
import {useAppState} from '../../../core/functions/use-app-state';
import {useAppearance} from '../../../core/functions/use-appearance';
import {Institution} from '../../../core/models/credit';
import {unquoteMessage} from '../../../core/reducers/chat-server';
import {getDraftQuotedMessage} from '../api/get-draft-quoted-message';

const Container = styled(View)`
	border-left-width: 4px;
	border-left-color: ${(props) => props.theme.SUBTITLE};
	background-color: ${(props) => props.theme.TAG_BACKGROUND};
	padding-left: 10px;
	flex-direction: row;
	align-items: center;
`;

const MessageView = styled(View)`
	padding-bottom: 14px;
	padding-top: 10px;
	flex: 1;
`;

const Username = styled(Text)`
	font-weight: bold;
	color: ${(props) => props.theme.TITLE};
`;
const Label = styled(ParsedText)`
	color: ${(props) => props.theme.TITLE};
`;

const UnquoteMessage = styled(TouchableOpacity)`
	padding: 12px;
`;

const ClearIcon = styled(Image)`
	height: 20px;
	width: 20px;
	tint-color: ${(props) => props.theme.SUBTITLE};
`;

export const ChatDraftedQuote = (props: {
	uni_identifier: string;
	university: Institution;
}) => {
	const roomId = getChatRoomIdentifier(props.uni_identifier, props.university);
	const quoted = useAppState((state) =>
		getDraftQuotedMessage(state, props.university, props.uni_identifier, roomId)
	);
	const userPool = useAppState((state) => getUserPool(state));
	const dispatch = useDispatch();
	const appearance = useAppearance();
	const onUnquote = React.useCallback(() => {
		dispatch(unquoteMessage(roomId));
	}, [dispatch, roomId]);
	const parse = useMemo(() => {
		return parsePatterns(userPool, appearance);
	}, [appearance, userPool]);
	if (!quoted) {
		return null;
	}

	const userOfQuoted = quoted
		? userPool.find((u) => u.id === quoted.user._id)
		: null;

	return (
		<Container>
			<MessageView>
				<Username>
					{userOfQuoted ? <Label>{userOfQuoted.username}</Label> : null}
				</Username>
				<Label parse={parse} numberOfLines={2}>
					{chatMessageWithOverride(quoted)}
				</Label>
			</MessageView>
			<UnquoteMessage onPress={onUnquote}>
				<ClearIcon source={require('../assets/clear.png')} />
			</UnquoteMessage>
		</Container>
	);
};
