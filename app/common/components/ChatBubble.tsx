/* eslint-disable no-underscore-dangle, no-use-before-define, react/require-default-props */

import {connectActionSheet} from '@expo/react-native-action-sheet';
import ms from 'ms';
import PropTypes from 'prop-types';
import React from 'react';
import {
	Clipboard,
	ImageStyle,
	Platform,
	StyleSheet,
	TextStyle,
	TouchableWithoutFeedback,
	View,
	ViewStyle,
} from 'react-native';
import {
	LeftRightStyle,
	MessageText,
	Time,
	utils,
} from 'react-native-gifted-chat';
import {Alert, Text} from 'react-native-normalized';
import {TouchableProps} from 'react-native-svg';
import {connect} from 'react-redux';
import styled from 'styled-components';
import {
	ChatMessage,
	DeleteMessageRequest,
	MessageDeletedPayload,
	MessageLike,
	ReportMessageRequest,
	SocketChatMessageTypes,
	SystemMessageType,
	UnlikeMessagePayload,
} from '../../../core/actions/chat-server';
import {MessageAttachmentView} from '../../../core/components/MessageAttachmentView';
import {QuotedMessage} from '../../../core/components/QuotedMessage';
import {Spacer} from '../../../core/components/UI/Spacer';
import {reportMessage} from '../../../core/functions/api';
import {apiRequest} from '../../../core/functions/api-request';
import {TabIndex} from '../../../core/functions/get-chat-room-identifier';
import {getUserHash} from '../../../core/functions/get-user-hash';
import {hapticFeedback} from '../../../core/functions/HapticFeedback';
import {hasGodmodeAccess} from '../../../core/functions/has-godmode-access';
import {globalStyles} from '../../../core/functions/styles';
import {truthy} from '../../../core/functions/truthy';
import {
	AppearanceMap,
	getAppearanceMap,
} from '../../../core/functions/use-appearance';
import {wasMessageDeleted} from '../../../core/functions/was-message-deleted';
import {welcomeMessageUser} from '../../../core/functions/welcome-message-user';
import {AppLanguage} from '../../../core/models/app-language';
import {GREEN} from '../../../core/models/colors';
import {Credit, Institution} from '../../../core/models/credit';
import rawStrings from '../../../core/raw-strings';
import {
	addToUnsentLikes,
	quoteMessage,
	signalUnlike,
} from '../../../core/reducers/chat-server';
import {
	selectMessage,
	unselectAll,
	unselectMessage,
} from '../../../core/reducers/selected-messages';
import {AppState} from '../../../core/types/app-state';
import {Navigation} from '../../../core/types/Navigation';
import {IMessageWithQuotes} from '../../../core/types/types';
import {shouldShowMessageText} from '../../../web/src/helpers/should-show-message-text';
import {findChatMessageById} from '../api/find-chat-message-by-id';
import {BestandeSystemMessage} from '../api/format-system-message';
import {isOwnMessage} from '../api/is-own-message';
import {ModerationHelpLabel} from './ModerationHelpLabel';
import {ReportGradeScreens} from './ReportGrade/ReportGradeNavigator';
import {VerifiedIcon} from './VerifiedIcon';

const MessageDeleted = styled(Text)`
	color: ${(props) => props.theme.MESSAGE_DELETED};
`;

const MessageContainer = styled(View)<{
	sent: boolean;
	selected: boolean;
}>`
	opacity: ${(props) => (props.sent ? 1 : 0.5)};
	background-color: ${(props) =>
		props.selected ? props.theme.TAG_BACKGROUND : 'transparent'};
`;

const {isSameUser, isSameDay} = utils;

// Note: Everything is forced to be "left" positioned with this component.
// The "right" position is only used in the default Bubble.
const styles = StyleSheet.create({
	standardFont: {
		fontSize: 15,
	},
	slackMessageText: {
		marginLeft: 0,
		marginRight: 0,
	},
	container: {
		flex: 1,
		alignItems: 'flex-start',
	},
	wrapper: {
		marginRight: 30,
		minHeight: 20,
		justifyContent: 'flex-end',
		width: '100%',
		paddingRight: 24,
	},
	username: {
		fontWeight: 'bold',
	},
	time: {
		textAlign: 'left',
		fontSize: 12,
	},
	timeContainer: {
		marginLeft: 0,
		marginRight: 0,
		marginBottom: 0,
	},
	headerView: {
		// Try to align it better with the avatar on Android.
		marginTop: Platform.OS === 'android' ? -2 : 0,
		flexDirection: 'row',
		alignItems: 'center',
	},
	tick: {
		backgroundColor: 'transparent',
		color: 'white',
	},
	tickView: {
		flexDirection: 'row',
	},
	slackImage: {
		borderRadius: 3,
		marginLeft: 0,
		marginRight: 0,
	},
});

type OwnProps = {
	onLongPress?: (context: any, message: IMessageWithQuotes) => void;
	currentMessage: IMessageWithQuotes;
	nextMessage?: IMessageWithQuotes;
	previousMessage?: IMessageWithQuotes;
	touchableProps?: TouchableProps;
	renderUsername?: (info: Props) => any;
	renderTime?: (info: Props) => any;
	containerStyle?: LeftRightStyle<ViewStyle>;
	wrapperStyle?: LeftRightStyle<ViewStyle>;
	messageTextStyle?: TextStyle;
	usernameStyle?: TextStyle;
	tickStyle?: TextStyle;
	containerToNextStyle?: LeftRightStyle<ViewStyle>;
	containerToPreviousStyle?: LeftRightStyle<ViewStyle>;
	imageStyle?: ImageStyle;
	moderationView: boolean;
	chatMessage: ChatMessage | null;
	showActionSheetWithOptions: (a: any, b: any) => void;
	language: AppLanguage;
	appearance: AppearanceMap;
	roomId: string;
	uni_identifier: string;
	university: Institution;
	goToTab: (tabIndex: TabIndex) => void;
	credit: Credit | null;
	navigation: Navigation;
	selectMessage: (messageId: string) => void;
	unselectMessage: (messageId: string) => void;
	unselectAll: () => void;
	selectedMessages: string[];
};

type Props = OwnProps & {
	systemMessage: ChatMessage;
	chatInstance: SocketIOClient.Socket;
	userHash: string;
	messageDeleted: MessageDeletedPayload | null;
	isOwnMessage: boolean;
	isGodmode: boolean;
	didUserLike: MessageLike;
	addToUnsentLikes: (like: string) => void;
	signalUnlike: (messageId: string) => void;
	quoteMessage: (channelId: string, messageId: string) => void;
};

type State = {
	lastPress: number;
};

type Context = {
	actionSheet: () => void;
};

class Bubble extends React.Component<Props, State, Context> {
	static contextTypes = {
		actionSheet: PropTypes.func,
	};

	state = {
		lastPress: 0,
	};

	constructor(props) {
		super(props);
		this.onLongPress = this.onLongPress.bind(this);
	}

	isSelected() {
		return this.props.selectedMessages.includes(
			this.props.currentMessage._id as string
		);
	}

	onLongPress() {
		if (this.props.onLongPress) {
			this.props.onLongPress(this.context, this.props.currentMessage);
		} else if (this.props.currentMessage.text) {
			const channelOption = 'Go to channel';
			const options = [
				rawStrings.COPY_TEXT[this.props.language],
				this.props.currentMessage.user._id !== welcomeMessageUser._id &&
					rawStrings.QUOTE_MESSAGE[this.props.language],
				this.props.chatInstance &&
				(this.props.isOwnMessage || this.props.moderationView) &&
				this.props.currentMessage.user._id !== welcomeMessageUser._id
					? rawStrings.DELETE_MESSAGE[this.props.language]
					: null,
				this.props.moderationView && this.props.chatMessage
					? channelOption
					: null,
				this.props.currentMessage.user._id === welcomeMessageUser._id ||
				this.props.isOwnMessage
					? null
					: rawStrings.REPORT_MESSAGE[this.props.language],
				this.props.isGodmode
					? rawStrings.MARK_AS_GRADE_REPORT[this.props.language]
					: null,
				!this.isSelected() && this.props.isGodmode
					? rawStrings.SELECT_MESSAGE_ADMIN[this.props.language]
					: null,
				this.isSelected() && this.props.isGodmode
					? rawStrings.UNSELECT_MESSAGE_ADMIN[this.props.language]
					: null,
				this.props.isGodmode
					? rawStrings.SELECT_AND_RENDER_ADMIN[this.props.language]
					: null,
				rawStrings.CANCEL[this.props.language],
			].filter(truthy);
			const cancelButtonIndex = options.length - 1;
			this.context.actionSheet().showActionSheetWithOptions(
				{
					options,
					cancelButtonIndex,
					destructiveButtonIndex: options.indexOf(
						rawStrings.DELETE_MESSAGE[this.props.language]
					),
				},
				(buttonIndex) => {
					if (
						options[buttonIndex] === rawStrings.COPY_TEXT[this.props.language]
					) {
						Clipboard.setString(this.props.currentMessage.text);
					}

					if (
						options[buttonIndex] ===
						rawStrings.QUOTE_MESSAGE[this.props.language]
					) {
						this.props.quoteMessage(
							this.props.roomId,
							String(this.props.currentMessage._id)
						);
					}

					if (
						options[buttonIndex] ===
						rawStrings.DELETE_MESSAGE[this.props.language]
					) {
						if (this.props.chatInstance) {
							const payload: DeleteMessageRequest = {
								token: this.props.userHash,
								messageId: String(this.props.currentMessage._id),
							};
							this.props.chatInstance.emit(
								SocketChatMessageTypes.DELETE_MESSAGE_REQUEST,
								payload
							);
						} else {
							Alert.alert(
								rawStrings.ERROR[this.props.language],
								rawStrings.COULD_NOT_DELETE_MESSAGE_BECAUSE_NOT_CONNECTED[
									this.props.language
								]
							);
						}
					}

					if (options[buttonIndex] === channelOption) {
						this.props.navigation.navigate('CreditDetailView', {
							moduleId: this.props.chatMessage?.uni_identifier as string,
							institution: this.props.chatMessage?.university as Institution,
							chatFirst: true,
							credit: null,
							semester: null,
						});
					}

					if (
						options[buttonIndex] ===
						rawStrings.MARK_AS_GRADE_REPORT[this.props.language]
					) {
						this.props.navigation.navigate('ReportGrade', {
							// @ts-expect-error
							screen: 'ReportGradeStart',
							params: {
								uni_identifier: this.props.uni_identifier,
								university: this.props.university,
								goToStatistic: () => undefined,
								usernameOverride: this.props.currentMessage.user.name,
								suggestedEndDate:
									(this.props.currentMessage.createdAt as number) + ms('60s'),
							} as ReportGradeScreens['ReportGradeStart'],
						});
					}

					if (
						options[buttonIndex] ===
						rawStrings.REPORT_MESSAGE[this.props.language]
					) {
						const {
							REPORT_SPAM,
							REPORT_INAPPROPRIATE,
							REPORT_SEXUAL_CONTENT,
							REPORT_PROHIBITED_CONTENT,
							REPORT_HARASSMENT,
							REPORT_OFFENSIVE,
							REPORT_OTHER,
						} = rawStrings;
						const reportOptions: string[] = [
							REPORT_SPAM[this.props.language],
							REPORT_INAPPROPRIATE[this.props.language],
							REPORT_SEXUAL_CONTENT[this.props.language],
							REPORT_PROHIBITED_CONTENT[this.props.language],
							REPORT_HARASSMENT[this.props.language],
							REPORT_OFFENSIVE[this.props.language],
							REPORT_OTHER[this.props.language],
							rawStrings.CANCEL[this.props.language],
						];
						const reportCancelButtonIndex = reportOptions.length - 1;

						this.props.showActionSheetWithOptions(
							{
								options: reportOptions,
								cancelButtonIndex: reportCancelButtonIndex,
							},
							(newButtonIndex) => {
								const reason = reportOptions[newButtonIndex];
								if (reason !== rawStrings.CANCEL[this.props.language]) {
									const reportPayload: ReportMessageRequest = {
										messageId: String(this.props.currentMessage._id),
										token: this.props.userHash,
										reason:
											reason === REPORT_SPAM[this.props.language]
												? 'spam'
												: reason === REPORT_INAPPROPRIATE[this.props.language]
												? 'inappropriate'
												: reason === REPORT_SEXUAL_CONTENT[this.props.language]
												? 'sexual-content'
												: reason ===
												  REPORT_PROHIBITED_CONTENT[this.props.language]
												? 'prohibited-content'
												: reason === REPORT_HARASSMENT[this.props.language]
												? 'harassment'
												: reason === REPORT_OFFENSIVE[this.props.language]
												? 'offensive'
												: 'other',
									};
									reportMessage(reportPayload)
										.then(() => {
											Alert.alert(
												rawStrings.THANKS_FOR_REPORTING[this.props.language],
												rawStrings.THANKS_FOR_REPORTING_DONE[
													this.props.language
												]
											);
										})
										.catch((err) => {
											Alert.alert(
												rawStrings.ERROR[this.props.language] +
													':' +
													err.message
											);
										});
									this.props.chatInstance.emit(
										SocketChatMessageTypes.REPORT_MESSAGE,
										reportPayload
									);
								}
							}
						);
					}

					if (
						options[buttonIndex] ===
						rawStrings.SELECT_MESSAGE_ADMIN[this.props.language]
					) {
						const id = this.props.currentMessage._id as string;
						if (!id) {
							return;
						}

						this.props.selectMessage(id);
					}

					if (
						options[buttonIndex] ===
						rawStrings.UNSELECT_MESSAGE_ADMIN[this.props.language]
					) {
						const id = this.props.currentMessage._id as string;
						if (!id) {
							return;
						}

						this.props.unselectMessage(id);
					}

					if (
						options[buttonIndex] ===
						rawStrings.SELECT_AND_RENDER_ADMIN[this.props.language]
					) {
						const id = this.props.currentMessage._id as string;
						if (!id) {
							return;
						}

						const selected = [...this.props.selectedMessages, id];
						this.props.unselectAll();
						apiRequest('/chat/video', {
							method: 'post',
							body: JSON.stringify({
								messageIds: selected,
								token: this.props.userHash,
							}),
						})
							.then(() => {
								// eslint-disable-next-line no-alert
								alert('Triggered video!');
							})
							.catch((err) => {
								// eslint-disable-next-line no-alert
								alert('Error: ' + err.message);
							});
					}
				}
			);
		}
	}

	renderMessageText() {
		if (shouldShowMessageText(this.props.currentMessage)) {
			const {
				containerStyle,
				wrapperStyle,
				messageTextStyle,
				...messageTextProps
			} = this.props;
			if (this.props.currentMessage.system) {
				return (
					<BestandeSystemMessage
						credit={this.props.credit}
						goToTab={this.props.goToTab}
						msg={this.props.systemMessage}
					/>
				);
			}

			if (this.props.messageDeleted) {
				if (this.props.messageDeleted.reason === 'author-removed') {
					return (
						<MessageDeleted>
							{rawStrings.MESSAGE_DELETED_BY_AUTHOR[this.props.language]}
						</MessageDeleted>
					);
				}

				if (this.props.messageDeleted.reason === 'admin-removed') {
					return (
						<MessageDeleted>
							{rawStrings.MESSAGE_DELETED_BY_ADMIN[this.props.language]}
						</MessageDeleted>
					);
				}

				return (
					<MessageDeleted>
						{rawStrings.MESSAGE_DELETED[this.props.language]}
					</MessageDeleted>
				);
			}

			return (
				<MessageContainer
					sent={Boolean(this.props.currentMessage.sent)}
					selected={this.isSelected()}
				>
					<MessageText
						{...messageTextProps}
						textStyle={{
							left: {
								...styles.standardFont,
								...styles.slackMessageText,
								...messageTextStyle,
							},
							right: {},
						}}
					/>
					{this.props.moderationView ? (
						<ModerationHelpLabel message={this.props.currentMessage} />
					) : null}
				</MessageContainer>
			);
		}

		return null;
	}

	renderUsername() {
		const username = this.props.currentMessage.user.name;
		if (username) {
			return (
				<Text
					style={[
						styles.standardFont,
						styles.username,
						this.props.usernameStyle,
						{
							color: this.props.currentMessage.user.verified
								? GREEN
								: this.props.appearance.TITLE,
						},
					]}
				>
					{username}
				</Text>
			);
		}

		return null;
	}

	renderTime() {
		if (this.props.currentMessage.createdAt) {
			const {containerStyle, wrapperStyle, ...timeProps} = this.props;
			if (this.props.renderTime) {
				return this.props.renderTime(timeProps);
			}

			if (
				this.props.systemMessage?.systemMessageMetadata?.type &&
				this.props.systemMessage?.systemMessageMetadata?.type ===
					SystemMessageType.EXAM_RETURNED
			) {
				return null;
			}

			return (
				<Time
					{...timeProps}
					containerStyle={{left: [styles.timeContainer], right: {}}}
					timeTextStyle={{
						left: [
							styles.standardFont,
							styles.time,
							{color: this.props.appearance.SUBTITLE},
						],
						right: {},
					}}
				/>
			);
		}

		return null;
	}

	onPress() {
		const delta = new Date().getTime() - this.state.lastPress;

		if (delta < 200) {
			if (this.props.chatInstance) {
				if (this.props.didUserLike) {
					const unlikePayload: UnlikeMessagePayload = {
						messageId: String(this.props.currentMessage._id),
						token: this.props.userHash,
					};
					this.props.chatInstance.emit(
						SocketChatMessageTypes.UNLIKE_MESSAGE,
						unlikePayload
					);
					this.props.signalUnlike(String(this.props.currentMessage._id));
				} else {
					this.props.addToUnsentLikes(String(this.props.currentMessage._id));
				}

				hapticFeedback('impact');
			}
		}

		this.setState({
			lastPress: new Date().getTime(),
		});
	}

	renderVerified() {
		return (
			<View>
				<VerifiedIcon />
			</View>
		);
	}

	render() {
		const isSameThread =
			isSameUser(this.props.currentMessage, this.props.previousMessage) &&
			isSameDay(this.props.currentMessage, this.props.previousMessage);

		const messageHeader = isSameThread ? null : (
			<View style={styles.headerView}>
				{this.renderUsername()}
				<Spacer />
				{this.props.currentMessage.user.verified ? (
					<>
						{this.renderVerified()}
						<Spacer />
					</>
				) : null}
				{this.renderTime()}
			</View>
		);

		return (
			<View style={styles.container}>
				<TouchableWithoutFeedback
					onPress={() => {
						this.onPress();
					}}
					onLongPress={this.props.messageDeleted ? undefined : this.onLongPress}
					// @ts-expect-error
					accessibilityTraits="text"
					{...this.props.touchableProps}
				>
					<View style={styles.wrapper}>
						<View style={globalStyles.flex1}>
							{messageHeader}
							{this.props.currentMessage.quotes &&
							!this.props.messageDeleted ? (
								<QuotedMessage
									uni_identifier={this.props.uni_identifier}
									university={this.props.university}
									messageId={this.props.currentMessage.quotes}
								/>
							) : null}
							{this.renderMessageText()}
							{this.props.currentMessage.attachments ? (
								<MessageAttachmentView
									attachments={this.props.currentMessage.attachments}
								/>
							) : null}
						</View>
					</View>
				</TouchableWithoutFeedback>
			</View>
		);
	}
}

export const ChatBubble = connect(
	(state: AppState, props: OwnProps) => {
		const {userProfile} = state.users;
		return {
			systemMessage: props.currentMessage.system
				? (state.chatServer.systemMessages.find(
						(m) => m._id === props.currentMessage._id
				  ) as ChatMessage)
				: null,
			chatInstance: state.chatServer.chatInstance,
			userHash: getUserHash(state, null),
			messageDeleted: wasMessageDeleted(state, props.currentMessage),
			isOwnMessage: isOwnMessage(state, props.currentMessage),
			chatMessage: props.moderationView
				? findChatMessageById(state, String(props.currentMessage._id))
				: null,
			language: state.language.selectedLanguage,
			appearance: getAppearanceMap(state.appearance),
			didUserLike: userProfile
				? state.chatServer.likes.find(
						(l) =>
							l.messageId === props.currentMessage._id &&
							l.likedBy === userProfile.id
				  )
				: null,
			selectedMessages: state.selectedMessages.selected,
			isGodmode: hasGodmodeAccess(state),
		};
	},
	{
		addToUnsentLikes,
		signalUnlike,
		quoteMessage,
		selectMessage,
		unselectMessage,
		unselectAll,
	}
)(connectActionSheet(Bubble));
