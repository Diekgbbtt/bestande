import React, {useEffect, useState} from 'react';
import {Platform, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-normalized';
import ParsedText from 'react-native-parsed-text';
import {useDispatch} from 'react-redux';
import styled from 'styled-components/native';
import {SingleMessageApiResponse} from '../actions/chat-server';
import {getSingleMessage} from '../functions/api';
import {chatMessageWithOverride} from '../functions/chat-message-with-override';
import {getQuotedMessage} from '../functions/get-quoted-message';
import {getUserPool} from '../functions/get-user-pool';
import {parsePatterns} from '../functions/parse-patterns';
import {useAppState} from '../functions/use-app-state';
import {useAppearance} from '../functions/use-appearance';
import {useLanguage} from '../functions/use-language';
import {Institution} from '../models/credit';
import rawStrings from '../raw-strings';
import {scrollToMessage} from '../reducers/chat-server';

const Container = styled(TouchableOpacity)`
	border-color: ${(props) => props.theme.BORDER_COLOR};
	padding: 4px 8px;
	border-left-width: 4px;
	border-bottom-left-radius: 0;
	border-top-left-radius: 0;
	margin-top: 3px;
	background-color: ${(props) => props.theme.TAG_BACKGROUND};
	flex: 1;
`;

const UsernameLabel = styled(Text)`
	font-weight: bold;
	color: ${(props) => props.theme.SUBTITLE};
`;

const Message = styled(Platform.OS === 'web' ? Text : ParsedText)<{
	parse?: any[];
}>`
	color: ${(props) => props.theme.SUBTITLE};
`;

export const QuotedMessage = (props: {
	messageId: string;
	uni_identifier: string;
	university: Institution;
}) => {
	const language = useLanguage();
	const message = useAppState((state) =>
		getQuotedMessage(
			state,
			props.university,
			props.uni_identifier,
			props.messageId,
			language,
			'',
			false,
			false
		)
	);
	const [apiResponse, setApiResponse] = useState<SingleMessageApiResponse>();
	const [error, setError] = useState<Error | null>(null);
	const dispatch = useDispatch();
	const userPool = useAppState((state) => getUserPool(state));
	const user = message ? userPool.find((f) => f.id === message.user._id) : null;
	const appearance = useAppearance();
	const onPress = React.useCallback(() => {
		dispatch(scrollToMessage(props.messageId));
	}, [dispatch, props.messageId]);

	const fetchMessage = React.useCallback(async () => {
		try {
			const res = await getSingleMessage(props.messageId);
			setApiResponse(res.data);
		} catch (err) {
			setError(err);
		}
	}, [props.messageId]);

	useEffect(() => {
		if (!message) {
			fetchMessage();
		}
	}, [fetchMessage, message]);
	if (error) {
		return (
			<Container>
				<Message>
					<Message style={{fontWeight: 'bold'}}>
						{rawStrings.ERROR[language]}
					</Message>
					: <Message style={{fontStyle: 'italic'}}>{error.message}</Message>
				</Message>
			</Container>
		);
	}

	return (
		<Container onPress={onPress} disabled={!message}>
			<UsernameLabel>
				{user ? user.username : apiResponse ? apiResponse.user.username : null}
			</UsernameLabel>
			<Message numberOfLines={2} parse={parsePatterns(userPool, appearance)}>
				{message
					? chatMessageWithOverride(message)
					: apiResponse
					? chatMessageWithOverride(apiResponse.message)
					: rawStrings.LOADING[language]}
			</Message>
		</Container>
	);
};
