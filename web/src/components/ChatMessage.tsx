import format from 'date-fns/format';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import {StyleSheet} from 'react-native';
import {Avatar} from 'react-native-gifted-chat';
import styled from 'styled-components';
import {MessageAttachmentView} from '../../../core/components/MessageAttachmentView';
import {QuotedMessage} from '../../../core/components/QuotedMessage';
import {useIsomorphicState} from '../../../core/functions/use-app-state';
import {wasMessageDeleted} from '../../../core/functions/was-message-deleted';
import {Institution} from '../../../core/models/credit';
import {IMessageWithQuotes} from '../../../core/types/types';
import {shouldShowMessageText} from '../helpers/should-show-message-text';

const Container = styled.div`
	display: flex;
	flex-direction: row;
	p {
		margin-top: 0;
		margin-bottom: 0;
	}
`;

const Username = styled.div`
	font-weight: bold;
	font-size: 0.8em;
`;

const Time = styled.span`
	color: gray;
	font-size: 0.9em;
	font-weight: normal;
`;

const styles = StyleSheet.create({
	slackAvatar: {
		// The bottom should roughly line up with the first line of message text.
		height: 40,
		width: 40,
		borderRadius: 3,
	},
});

export const ChatMessage = (props: {
	message: IMessageWithQuotes;
	uni_identifier: string;
	university: Institution;
}) => {
	const messageDeleted = useIsomorphicState((state) =>
		wasMessageDeleted(state, props.message)
	);
	const messageObj = React.useMemo(() => {
		return {
			...props.message,
			user: {
				...props.message.user,
				avatar:
					// @ts-expect-error
					props.message.user.avatar?.data?.uri ?? props.message.user.avatar,
			},
		};
	}, [props.message]);
	return (
		<Container>
			<Avatar
				currentMessage={messageObj}
				imageStyle={{
					left: [styles.slackAvatar],
					right: [],
				}}
			/>
			<div>
				<Username>
					{props.message.user.name}{' '}
					<Time>
						{format(props.message.createdAt, 'dd. MMMM yyyy,  HH:mm')}
					</Time>
				</Username>
				{props.message.quotes && !messageDeleted ? (
					<QuotedMessage
						uni_identifier={props.uni_identifier}
						university={props.university}
						messageId={props.message.quotes}
					/>
				) : null}
				{shouldShowMessageText(props.message) ? (
					<ReactMarkdown source={props.message.text} />
				) : null}
				{props.message.attachments ? (
					<MessageAttachmentView attachments={props.message.attachments} />
				) : null}
			</div>
		</Container>
	);
};
