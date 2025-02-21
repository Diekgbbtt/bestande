import React, {ReactNode} from 'react';
import {StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import {LeftRightStyle, utils} from 'react-native-gifted-chat';
import {IMessageWithQuotes} from '../../../core/types/types';
import {GiftedAvatar} from './GiftedAvatar';

const {isSameDay, isSameUser} = utils;

const styles = StyleSheet.create({
	container: {
		marginRight: 8,
	},
	onTop: {
		alignSelf: 'flex-start',
	},
	onBottom: {},
});

interface AvatarProps {
	currentMessage?: IMessageWithQuotes;
	previousMessage?: IMessageWithQuotes;
	nextMessage?: IMessageWithQuotes;
	renderAvatarOnTop?: boolean;
	showAvatarForEveryMessage?: boolean;
	containerStyle?: LeftRightStyle<ViewStyle>;
	textStyle?: TextStyle;
	renderAvatar?(props: AvatarProps): ReactNode;
	show: boolean;
}

export default class ChatMessageAvatar extends React.Component<AvatarProps> {
	renderAvatar() {
		if (this.props.renderAvatar) {
			const {renderAvatar, ...avatarProps} = this.props;
			return this.props.renderAvatar(avatarProps);
		}

		if (this.props.currentMessage) {
			return (
				<GiftedAvatar
					textStyle={this.props.textStyle ? this.props.textStyle : {}}
					user={this.props.currentMessage.user}
				/>
			);
		}

		return null;
	}

	render() {
		const {
			renderAvatarOnTop,
			showAvatarForEveryMessage,
			containerStyle,
			currentMessage,
			renderAvatar,
			previousMessage,
			nextMessage,
		} = this.props;
		const messageToCompare = renderAvatarOnTop ? previousMessage : nextMessage;
		const computedStyle = renderAvatarOnTop ? 'onTop' : 'onBottom';

		if (renderAvatar === null) {
			return null;
		}

		if (
			!showAvatarForEveryMessage &&
			currentMessage &&
			messageToCompare &&
			isSameUser(currentMessage, messageToCompare) &&
			isSameDay(currentMessage, messageToCompare)
		) {
			return (
				<View style={[styles.container, containerStyle?.left]}>
					<GiftedAvatar user={null} />
				</View>
			);
		}

		return (
			<View style={[styles.container, styles[computedStyle], containerStyle]}>
				{this.renderAvatar()}
			</View>
		);
	}
}
