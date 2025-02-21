import React, {useMemo} from 'react';
import {View} from 'react-native';
import {Image} from 'react-native-normalized';
import ParsedText from 'react-native-parsed-text';
import styled from 'styled-components/native';
import {ChatMessage} from '../../../core/actions/chat-server';
import {chatMessageWithOverride} from '../../../core/functions/chat-message-with-override';
import {CreditHelpers} from '../../../core/functions/CreditHelpers';
import {getMessagesForChannelToDisplay} from '../../../core/functions/get-messages-for-channel-to-display';
import {getModuleId} from '../../../core/functions/get-module-id';
import {getUnreadMessages} from '../../../core/functions/get-unread-messages';
import {getUserPool} from '../../../core/functions/get-user-pool';
import {parsePatterns} from '../../../core/functions/parse-patterns';
import {globalStyles} from '../../../core/functions/styles';
import {useAppState} from '../../../core/functions/use-app-state';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import {AppLanguage} from '../../../core/models/app-language';
import {Credit} from '../../../core/models/credit';
import {IMessageWithQuotes} from '../../../core/types/types';
import {getPlainTextSystemMessage} from '../api/format-system-message';
import {getTypingIndicatorString} from '../api/get-typing-indicator-string';
import {getTypingIndicator} from '../api/get-typing-indicators';
import {FontWithTransition} from './FontWithTransition';

const Container = styled(View)`
	margin-top: 4px;
	flex-direction: row;
	align-items: center;
`;

const Label = styled(FontWithTransition)<{systemMessage: boolean}>`
	padding-right: 16px;
	font-style: ${(props) => (props.systemMessage ? 'italic' : 'normal')};
`;

const Icon = styled(Image)<{sent: boolean}>`
	height: ${(props) => (props.sent ? 16 : 14)}px;
	width: ${(props) => (props.sent ? 16 : 14)}px;
	margin-left: -1px;
	margin-top: 2px;
`;

type Props = {
	credit: Credit;
};

const getLabelText = (msg: IMessageWithQuotes) => {
	return `${msg.user.name}: ${chatMessageWithOverride(msg)}`;
};

const getFormattedSystemMessage = (
	msg: IMessageWithQuotes,
	systemMessages: ChatMessage[],
	language: AppLanguage
) => {
	const chatMessage = systemMessages.find(
		(m) => m._id === msg._id
	) as ChatMessage;
	return getPlainTextSystemMessage(chatMessage, language);
};

export const CreditCellChatMessage = (props: Props) => {
	const uni_identifier = getModuleId(props.credit) as string;
	const university = CreditHelpers.getInstitution(props.credit);
	const language = useLanguage();
	const messages = useAppState((state) =>
		getMessagesForChannelToDisplay(
			state,
			university,
			uni_identifier,
			language,
			props.credit.short_name,
			false,
			false
		)
	);
	const deletedMessages = useAppState(
		(state) => state.chatServer.deletedMessages
	);
	const messagesButNoDeletedOnes = messages.filter(
		(m) => !deletedMessages.find((deleted) => deleted.messageID === m._id)
	);
	const messageToShow = messagesButNoDeletedOnes[0];
	const systemMessages = useAppState(
		(state) => state.chatServer.systemMessages
	);
	const userPool = useAppState((state) => getUserPool(state));

	const usersTyping = useAppState((state) =>
		getTypingIndicator(state, uni_identifier, university)
	);

	const unreadMessages = useAppState((state) =>
		getUnreadMessages(state, uni_identifier, university)
	);

	const appearance = useAppearance();

	const parse = useMemo(() => {
		return parsePatterns(userPool, appearance);
	}, [appearance, userPool]);

	if (usersTyping.length > 0) {
		return (
			<Container>
				<Icon
					sent
					source={require('../assets/twotone_chat_bubble_black_48dp.png')}
					style={{
						tintColor: appearance.ICON_TINT,
					}}
				/>
				<View style={{width: 10}} />
				<Label
					style={{color: appearance.CHAT_PREVIEW_SYSTEM_MESSAGE}}
					systemMessage
					text={getTypingIndicatorString(language, usersTyping)}
				/>
			</Container>
		);
	}

	if (!messageToShow) {
		return null;
	}

	const label = messageToShow.system
		? (getFormattedSystemMessage(
				messageToShow,
				systemMessages,
				language
		  ) as string)
		: getLabelText(messageToShow);

	const sent = Boolean(messageToShow.sent || messageToShow.system);
	return (
		<Container>
			<Icon
				source={
					sent
						? require('../assets/twotone_chat_bubble_black_48dp.png')
						: require('../assets/hourglass.png')
				}
				sent={sent}
				style={{
					tintColor:
						unreadMessages.length > 0
							? appearance.BLUE_TINT
							: appearance.ICON_TINT,
				}}
			/>
			<View style={{width: 10}} />
			{messageToShow.system ? (
				<Label
					systemMessage={messageToShow.system}
					text={label}
					style={{
						color: messageToShow.system
							? appearance.CHAT_PREVIEW_SYSTEM_MESSAGE
							: appearance.CHAT_PREVIEW_MESSAGE,
					}}
				/>
			) : (
				<ParsedText
					numberOfLines={1}
					style={{
						color: messageToShow.system
							? appearance.CHAT_PREVIEW_SYSTEM_MESSAGE
							: appearance.CHAT_PREVIEW_MESSAGE,
						paddingRight: 16,
					}}
					parse={parse}
				>
					{label}
				</ParsedText>
			)}
			<View style={globalStyles.flex1} />
		</Container>
	);
};
