import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import emojiUtils from 'emoji-utils';
import ms from 'ms';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Platform, View} from 'react-native';
import {email as composeEmail} from 'react-native-communications';
import {GiftedChat, MessageProps} from 'react-native-gifted-chat';
import {ActivityIndicator, Alert} from 'react-native-normalized';
import {useDispatch} from 'react-redux';
import styled from 'styled-components';
import {v4 as uuid} from 'uuid';
import {
	SocketChatMessageTypes,
	StartTypingPayload,
	StoppedTypingPayload,
} from '../../../core/actions/chat-server';
import {fetchPreviousMessages} from '../../../core/actions/chat-server-native';
import {ChatRoomSubscription} from '../../../core/components/ChatRoomSubscription';
import {Config} from '../../../core/data/Config';
import {getAvailableUnloadedChatMessages} from '../../../core/functions/available-unloaded-chat-messages';
import {
	getChatRoomIdentifier,
	TabIndex,
} from '../../../core/functions/get-chat-room-identifier';
import {getMessagesForChannelToDisplay} from '../../../core/functions/get-messages-for-channel-to-display';
import {getUserHash} from '../../../core/functions/get-user-hash';
import {getUserPool} from '../../../core/functions/get-user-pool';
import {giftedToMessage} from '../../../core/functions/gifted-to-message';
import {isLoadingPreviousMessages} from '../../../core/functions/is-loading-previous-message';
import {openLink} from '../../../core/functions/open-link';
import {parsePatterns} from '../../../core/functions/parse-patterns';
import {useAppState} from '../../../core/functions/use-app-state';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import {useNavigationInNative} from '../../../core/functions/useNavigationInNative';
import {wasMessageDeleted} from '../../../core/functions/was-message-deleted';
import {Credit, Institution} from '../../../core/models/credit';
import rawStrings from '../../../core/raw-strings';
import {
	addLastMessageTimestamp,
	addToUnsentMessages,
	resetScrollToMessage,
	setTypedAndUnsent,
	unquoteMessage,
	userReadChat,
	userStartedTyping,
	userStoppedTyping,
} from '../../../core/reducers/chat-server';
import {IMessageWithQuotes} from '../../../core/types/types';
import {getDraftQuotedMessage} from '../api/get-draft-quoted-message';
import {getOwnTypingIndicatorState} from '../api/get-own-typing-indicator-state';
import {hasToWaitToSendMoreMessages} from '../api/has-to-wait-to-send-more-messages';
import {shouldRenderSubscription} from '../api/should-render-subscription';
import {useDebounce} from '../api/use-debounce';
import {ChatBottom} from './ChatBottom';
import {ChatDraftedQuote} from './ChatDraftedQuote';
import {ChatMessageView} from './ChatMessageView';
import {ChatTypingIndicator} from './ChatTypingIndicator';
import {EnablePushNotifications} from './EnablePushNotifications';
import {KeyboardSpacer} from './KeyboardSpacer';
import {LoadEarlierMessagesButton} from './LoadEarlierMessagesButton';

const Container = styled(View)`
	flex: 1;
	background-color: ${(props) => props.theme.BACKGROUND};
`;

const MessageListContainer = styled(View)`
	flex: 1;
`;

const ActivityContainer = styled(View)`
	flex: 1;
	justify-content: center;
`;

type ChannelProps = {
	uni_identifier: string;
	university: Institution;
	moderationView: boolean;
	scrollToMessage: string | null;
	goToTab: (tab: TabIndex) => void;
	shouldScrollTo: (num: number) => void;
	credit: Credit | null;
};

type MProps = Readonly<MessageProps<IMessageWithQuotes>> &
	Readonly<{
		children?: React.ReactNode;
	}> &
	ChannelProps;

const Message = (props: MProps & ChannelProps) => {
	const currText = props.currentMessage?.text;

	const appearance = useAppearance();
	const navigation = useNavigationInNative();
	const deleted = useAppState((state) =>
		wasMessageDeleted(state, props.currentMessage as IMessageWithQuotes)
	);
	const scrollToMessage = useAppState((s) => s.chatServer.scrollToMessage);

	// Make "pure emoji" messages much bigger than plain text.
	const messageTextStyle = useMemo(
		() =>
			currText && emojiUtils.isPureEmojiString(currText)
				? {
						fontSize: 40,
						// Emoji get clipped if lineHeight isn't increased; make it consistent across platforms.
						lineHeight: Platform.OS === 'android' ? 46 : 44,
				  }
				: {
						color: appearance.TITLE,
				  },
		[appearance.TITLE, currText]
	);

	return (
		<ChatMessageView
			{...props}
			navigation={navigation}
			credit={props.credit}
			deleted={deleted}
			appearance={appearance}
			messageTextStyle={messageTextStyle}
			scrollToMessage={scrollToMessage}
		/>
	);
};

type Props = {
	uni_identifier: string;
	university: Institution;
	credit: Credit | null;
	goToTab: (tab: TabIndex) => void;
};

// Not putting it in state because changes to this will never cause rerender
let scrollPosition = 0;

export const Chat: React.FC<Props> = ({
	uni_identifier,
	university,
	goToTab,
	credit,
}) => {
	const ref = useRef<GiftedChat>(null);
	const container = useRef<View>(null);
	const bottomTabBarHeight = useBottomTabBarHeight();

	const userHash = useAppState((state) => getUserHash(state, null));

	const language = useLanguage();

	const dispatch = useDispatch();

	const messagesToDisplay = useAppState((state) =>
		getMessagesForChannelToDisplay(
			state,
			university,
			uni_identifier,
			language,
			credit ? credit.short_name : null,
			true,
			true
		)
	);

	const renderSubscription = useAppState((state) =>
		shouldRenderSubscription(state, uni_identifier, university)
	);

	const userPool = useAppState((state) => getUserPool(state));

	const userProfile = useAppState((state) => state.users.userProfile);

	const lastMessagesTimestamps = useAppState(
		(state) => state.chatServer.lastMessagesTimestamps
	);

	const channelId = getChatRoomIdentifier(uni_identifier, university);

	const savedMessage = useAppState(
		(state) => state.chatServer.chatTypedAndUnsent[channelId] || ''
	);

	const [inputMessage, setInputMessage] = useState<string>(savedMessage);

	const [
		didMountTextChangeFired,
		setDidMountTextChangeFired,
	] = useState<boolean>(false);

	const chatInstance = useAppState((state) => state.chatServer.chatInstance);

	const ownTypingIndicatorState = useAppState((state) =>
		getOwnTypingIndicatorState(state, uni_identifier, university)
	);

	const scrollToMessage = useAppState(
		(state) => state.chatServer.scrollToMessage
	);

	const appearance = useAppearance();

	// Log user has read messages on mount and unmount
	useEffect(() => {
		scrollPosition = 0;
		dispatch(userReadChat(uni_identifier, university));
		return () => {
			dispatch(userReadChat(uni_identifier, university));
		};
	}, [dispatch, uni_identifier, university]);

	const debouncesMessage = useDebounce(inputMessage, 1000);

	const quoted = useAppState((state) =>
		getDraftQuotedMessage(state, university, uni_identifier, channelId)
	);

	const stopTyping = useCallback(() => {
		const stoppedTypingPayload: StoppedTypingPayload = {
			token: userHash,
			uni_identifier,
			university,
		};
		if (chatInstance) {
			chatInstance.emit(
				SocketChatMessageTypes.STOPPED_TYPING,
				stoppedTypingPayload
			);
		}

		dispatch(
			userStoppedTyping(userProfile?.id as string, uni_identifier, university)
		);
	}, [
		chatInstance,
		dispatch,
		uni_identifier,
		university,
		userHash,
		userProfile?.id,
	]);

	useEffect(() => {
		dispatch(setTypedAndUnsent(channelId, debouncesMessage));
	}, [channelId, debouncesMessage, dispatch]);

	const onInputTextChanged = React.useCallback(
		(text: string) => {
			if (!userProfile) {
				return null;
			}

			if (!didMountTextChangeFired) {
				return setDidMountTextChangeFired(true);
			}

			setInputMessage(text);
			if (
				text !== '' &&
				(!ownTypingIndicatorState ||
					Date.now() - ownTypingIndicatorState.time > ms('10s'))
			) {
				const startedTypingPayload: StartTypingPayload = {
					token: userHash,
					uni_identifier,
					university,
				};
				dispatch(
					userStartedTyping(
						{
							id: userProfile.id,
							username: userProfile.username,
						},
						uni_identifier,
						university
					)
				);
				if (chatInstance) {
					chatInstance.emit(
						SocketChatMessageTypes.STARTED_TYPING,
						startedTypingPayload
					);
				}
			} else if (text === '' && ownTypingIndicatorState) {
				stopTyping();
			}
		},
		[
			chatInstance,
			didMountTextChangeFired,
			dispatch,
			ownTypingIndicatorState,
			stopTyping,
			uni_identifier,
			university,
			userHash,
			userProfile,
		]
	);

	const renderLoadEarlier = React.useCallback(() => {
		return (
			<LoadEarlierMessagesButton
				firstMessage={messagesToDisplay[messagesToDisplay.length - 1]}
				uni_identifier={uni_identifier}
				university={university}
			/>
		);
	}, [messagesToDisplay, uni_identifier, university]);

	const renderLoading = React.useCallback(() => {
		return (
			<ActivityContainer>
				<ActivityIndicator />
			</ActivityContainer>
		);
	}, []);

	const patterns = React.useCallback(
		() => [
			{
				type: 'url',
				style: {color: appearance.BLUE_TINT},
				onPress: (url: string) => openLink(url),
			},
			{
				type: 'email',
				style: {color: appearance.BLUE_TINT},
				onPress: (email) => composeEmail([email], null, null, null, null),
			},
			...parsePatterns(userPool, appearance),
		],
		[appearance, userPool]
	);

	const renderChatFooter = React.useCallback(() => {
		return (
			<>
				<ChatTypingIndicator
					uni_identifier={uni_identifier}
					university={university}
				/>
				<ChatDraftedQuote
					uni_identifier={uni_identifier}
					university={university}
				/>
			</>
		);
	}, [university, uni_identifier]);

	const onSend = React.useCallback(
		(newMessage: IMessageWithQuotes) => {
			if (hasToWaitToSendMoreMessages(lastMessagesTimestamps, 4)) {
				Alert.alert(
					rawStrings.COULD_NOT_SEND_MESSAGE[language],
					rawStrings.YOU_ARE_SENDING_TOO_MANY_MESSAGES[language]
				);
				return;
			}

			stopTyping();
			setInputMessage('');
			dispatch(addLastMessageTimestamp(Date.now()));
			dispatch(
				addToUnsentMessages({
					token: userHash,
					message: giftedToMessage(
						newMessage,
						userProfile?.id as string,
						university,
						uni_identifier,
						quoted ? String(quoted._id) : undefined,
						undefined
					),
				})
			);
			dispatch(unquoteMessage(channelId));
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			channelId,
			dispatch,
			language,
			lastMessagesTimestamps,
			quoted,
			uni_identifier,
			university,
			userHash,
			userProfile,
		] // Make sure it does not say userProfile.id!! otherwise crash
	);

	const loadingMessages = useAppState((state) =>
		isLoadingPreviousMessages(state, university, uni_identifier)
	);

	const loadEarlier = React.useCallback(() => {
		dispatch(
			fetchPreviousMessages(
				uni_identifier,
				university,
				30,
				Number(messagesToDisplay[messagesToDisplay.length - 1].createdAt),
				false
			)
		);
	}, [dispatch, messagesToDisplay, uni_identifier, university]);

	const availableUnloadedMessagesCount = useAppState((state) =>
		getAvailableUnloadedChatMessages(state, university, uni_identifier)
	);

	const listViewProps = React.useMemo(() => {
		return {
			initialListSize: 18,
			initialNumToRender: 18,
			onEndReachedThreshold: 0.5,
			onEndReached: () => {
				if (!loadingMessages && availableUnloadedMessagesCount) {
					loadEarlier();
				}
			},
			onScroll: (event) => {
				scrollPosition = event.nativeEvent.contentOffset.y;
			},
		};
	}, [availableUnloadedMessagesCount, loadEarlier, loadingMessages]);

	const renderMessage = React.useCallback(
		(
			message: Readonly<MessageProps<IMessageWithQuotes>> &
				Readonly<{
					children?: React.ReactNode;
				}>
		) => {
			return (
				<Message
					{...message}
					uni_identifier={uni_identifier}
					university={university}
					credit={credit}
					moderationView={uni_identifier === 'all'}
					goToTab={goToTab}
					scrollToMessage={scrollToMessage}
					shouldScrollTo={(num: number) => {
						container.current?.measure((x, y, width, height) => {
							ref.current?._messageContainerRef?.current?.scrollToOffset({
								offset: scrollPosition - num + height / 2,
							});
						});
						setTimeout(() => {
							dispatch(resetScrollToMessage());
						}, 400);
					}}
				/>
			);
		},
		[credit, dispatch, goToTab, scrollToMessage, uni_identifier, university]
	);

	const textInputProps = useMemo(
		() => ({
			style: {
				backgroundColor: appearance.BACKGROUND,
				color: appearance.TITLE,
			},
		}),
		[appearance.BACKGROUND, appearance.TITLE]
	);

	const user = useMemo(
		() =>
			userProfile
				? {
						_id: userProfile.id,
				  }
				: undefined,
		[userProfile]
	);

	const renderNull = useCallback(() => {
		return null;
	}, []);

	const onBottomSend = useCallback(
		(text: string) => {
			if (!user) {
				return;
			}

			const message: IMessageWithQuotes = {
				_id: uuid(),
				createdAt: Date.now(),
				text,
				user: {
					_id: user._id,
					verified: false,
				},
			};
			onSend(message);
		},
		[onSend, user]
	);

	const goToStatistic = useCallback(() => {
		goToTab('statistics');
	}, [goToTab]);

	if (Config.IS_WEB_APP) {
		return null;
	}

	return (
		<Container>
			{renderSubscription ? (
				<ChatRoomSubscription
					university={university}
					uni_identifier={uni_identifier}
				/>
			) : null}
			<MessageListContainer ref={container}>
				<GiftedChat
					ref={ref}
					maxInputLength={4000}
					loadEarlier
					timeFormat="HH:mm"
					messages={messagesToDisplay}
					showUserAvatar
					isKeyboardInternallyHandled={false}
					renderAvatarOnTop
					parsePatterns={patterns}
					text={inputMessage}
					textInputProps={textInputProps}
					renderMessage={renderMessage}
					renderInputToolbar={renderNull}
					user={user}
					onInputTextChanged={onInputTextChanged}
					renderChatFooter={renderChatFooter}
					renderLoading={renderLoading}
					wrapInSafeArea={false}
					renderLoadEarlier={renderLoadEarlier}
					listViewProps={listViewProps}
					minComposerHeight={0}
					maxComposerHeight={0}
					disableComposer
				/>
			</MessageListContainer>
			<EnablePushNotifications
				university={university}
				uni_identifier={uni_identifier}
			/>
			<ChatBottom
				text={inputMessage}
				onTextChanged={onInputTextChanged}
				userProfile={userProfile}
				uni_identifier={uni_identifier}
				onSend={onBottomSend}
				university={university}
				goToStatistic={goToStatistic}
			/>
			{Platform.OS === 'ios' ? (
				<KeyboardSpacer additionalOffsetWhenOpen={bottomTabBarHeight} />
			) : null}
		</Container>
	);
};
