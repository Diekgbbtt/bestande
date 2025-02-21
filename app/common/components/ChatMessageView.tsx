/* eslint-disable no-underscore-dangle, no-use-before-define, react/require-default-props */

import PropTypes from 'prop-types';
import React from 'react';
import {
	Animated,
	ImageStyle,
	StyleSheet,
	TextStyle,
	View,
	ViewPropTypes,
	ViewStyle,
} from 'react-native';
import {
	Day,
	LeftRightStyle,
	User as GiftedChatUser,
	utils,
} from 'react-native-gifted-chat';
import styled from 'styled-components';
import {MessageDeletedPayload} from '../../../core/actions/chat-server';
import {
	getChatRoomIdentifier,
	TabIndex,
} from '../../../core/functions/get-chat-room-identifier';
import {AppearanceMap} from '../../../core/functions/use-appearance';
import {welcomeMessageUser} from '../../../core/functions/welcome-message-user';
import {Credit, Institution} from '../../../core/models/credit';
import {Navigation} from '../../../core/types/Navigation';
import {IMessageWithQuotes} from '../../../core/types/types';
import {ChatBubble as Bubble} from './ChatBubble';
import ChatMessageAvatar from './ChatMessageAvatar';
import {MessageLikeButton} from './MessageLikeButton';
import {MessageLikes} from './MessageLikes';

const Spacer = styled(View)`
	width: 12px;
`;

const {isSameUser, isSameDay} = utils;

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
		paddingLeft: 8,
		marginRight: 0,
	},
	zeroHeight: {
		height: 0,
	},
	flex1: {
		flex: 1,
	},
	row: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'flex-end',
	},
});

export class ChatMessageView extends React.Component<{
	renderDay?: (info: any) => any;
	currentMessage: IMessageWithQuotes;
	previousMessage?: IMessageWithQuotes;
	nextMessage?: IMessageWithQuotes;
	containerStyle?: LeftRightStyle<ViewStyle>;
	imageStyle?: ImageStyle;
	navigation: Navigation;
	tickStyle?: TextStyle;
	user: GiftedChatUser;
	messageTextStyle?: TextStyle;
	containerToNextStyle?: LeftRightStyle<ViewStyle>;
	containerToPreviousStyle?: LeftRightStyle<ViewStyle>;
	uni_identifier: string;
	university: Institution;
	moderationView: boolean;
	appearance: AppearanceMap;
	scrollToMessage: string | null;
	shouldScrollTo: (num: number) => void;
	deleted: MessageDeletedPayload | null;
	goToTab: (tab: TabIndex) => void;
	credit: Credit | null;
}> {
	static defaultProps = {
		renderAvatar: undefined,
		renderDay: null,
		currentMessage: {},
		nextMessage: {},
		previousMessage: {},
		user: {},
		containerStyle: {},
	};

	static propTypes = {
		renderAvatar: PropTypes.func,
		renderDay: PropTypes.func,
		currentMessage: PropTypes.object,
		nextMessage: PropTypes.object,
		previousMessage: PropTypes.object,
		user: PropTypes.object,
		containerStyle: PropTypes.shape({
			left: ViewPropTypes.style,
			right: ViewPropTypes.style,
		}),
	};

	ref = React.createRef<View>();
	animatedValue = new Animated.Value(0);

	getInnerComponentProps() {
		const {containerStyle, ...props} = this.props;
		return {
			...props,
			position: 'left',
			isSameUser,
			isSameDay,
		};
	}

	renderDay() {
		if (this.props.currentMessage.createdAt) {
			const dayProps = this.getInnerComponentProps();
			if (this.props.renderDay) {
				return this.props.renderDay(dayProps);
			}

			return <Day {...dayProps} />;
		}

		return null;
	}

	renderBubble() {
		const bubbleProps = this.getInnerComponentProps();
		return (
			<View style={styles.flex1}>
				<View style={styles.row}>
					<View style={styles.flex1}>
						{/**
			// @ts-expect-error */}
						<Bubble
							{...bubbleProps}
							navigation={this.props.navigation}
							roomId={getChatRoomIdentifier(
								this.props.uni_identifier,
								this.props.university
							)}
							goToTab={this.props.goToTab}
							uni_identifier={this.props.uni_identifier}
							university={this.props.university}
							credit={this.props.credit}
							moderationView={bubbleProps.moderationView}
						/>
					</View>
					{this.props.currentMessage.system ||
					this.props.currentMessage.user._id === welcomeMessageUser._id ||
					this.props.deleted ? null : (
						<MessageLikeButton
							messageId={String(this.props.currentMessage._id)}
						/>
					)}
				</View>
				<MessageLikes messageId={String(this.props.currentMessage._id)} />
			</View>
		);
	}

	renderAvatar() {
		const avatarProps = this.getInnerComponentProps();
		return (
			<ChatMessageAvatar
				{...avatarProps}
				show={
					isSameUser(this.props.currentMessage, this.props.previousMessage) &&
					isSameDay(this.props.currentMessage, this.props.previousMessage)
				}
			/>
		);
	}

	componentDidUpdate(prevProps) {
		if (
			this.props.currentMessage?._id === this.props.scrollToMessage &&
			!prevProps.scrollToMessage
		) {
			this.ref.current?.measure((fx, fy, width, height, px, py) => {
				this.props.shouldScrollTo(py);
				Animated.timing(this.animatedValue, {
					toValue: 100,
					duration: 200,
					// usenativedriver must be false, not supported by native driver
					useNativeDriver: false,
				}).start();
			});
		}

		if (
			prevProps.currentMessage._id === prevProps.scrollToMessage &&
			!this.props.scrollToMessage
		) {
			Animated.timing(this.animatedValue, {
				toValue: 0,
				duration: 1000,
				// usenativedriver must be false, not supported by native driver

				useNativeDriver: false,
			}).start();
		}
	}

	render() {
		const marginBottom = isSameUser(
			this.props.currentMessage as IMessageWithQuotes,
			this.props.nextMessage
		)
			? 2
			: 10;
		const backgroundColor = this.animatedValue.interpolate({
			inputRange: [0, 100],
			outputRange: [
				this.props.appearance.BACKGROUND,
				this.props.appearance.MESSAGE_FLASH,
			],
		});
		return (
			<View ref={this.ref}>
				{this.renderDay()}
				<Animated.View
					style={[styles.container, {marginBottom, backgroundColor}]}
				>
					{this.renderAvatar()}
					{this.renderBubble()}
					<Spacer />
				</Animated.View>
			</View>
		);
	}
}
