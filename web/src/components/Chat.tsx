import React from 'react';
import styled from 'styled-components';
import {ChatRoomSubscription} from '../../../core/components/ChatRoomSubscription';
import {ChatServerManager} from '../../../core/components/ChatServerManager';
import {desktop, mobile} from '../../../core/components/layout/responsive';
import {getAvailableUnloadedChatMessages} from '../../../core/functions/available-unloaded-chat-messages';
import {getChatRoomIdentifier} from '../../../core/functions/get-chat-room-identifier';
import {getMessagesForChannelToDisplay} from '../../../core/functions/get-messages-for-channel-to-display';
import {useWebState} from '../../../core/functions/use-app-state';
import {GREEN} from '../../../core/models/colors';
import {Institution} from '../../../core/models/credit';
import {ChatMessage} from './ChatMessage';
import {DesktopContainer} from './layout/desktop-container';

type Props = {
	uni_identifier: string;
	university: Institution;
	name: string;
};

const Left = styled.div`
	flex: 1;
`;

const Right = styled.div`
	flex: 2;
	${desktop`
	max-height: 500px;
	overflow: auto;
	`}
`;

const Statistic = styled.div`
	font-size: 0.9em;
	padding-bottom: 4px;
	padding-top: 4px;
	border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

const Icon = styled.i`
	font-size: 18px;
	vertical-align: middle;
	margin-right: 10px;
`;

const BetaBadge = styled.div`
	background: ${GREEN};
	padding-left: 7px;
	padding-right: 7px;
	padding-top: 3px;
	padding-bottom: 2px;
	color: white;
	display: inline-block;
	font-size: 12px;
	font-weight: bold;
	border-radius: 3px;
`;

const Beta = styled.div`
	color: gray;
	font-size: 0.85em;
`;

const Layout = styled(DesktopContainer)`
	flex-direction: row;
	display: flex;
	${mobile`
		display: block;
	`}
`;

export const Chat = (props: Props) => {
	const {uni_identifier, university, name} = props;

	const language = useWebState((state) => state.language.selectedLanguage);

	const messagesToDisplay = useWebState((state) =>
		getMessagesForChannelToDisplay(
			state,
			university,
			uni_identifier,
			language,
			name,
			true,
			false
		)
	);
	const activeUsers = useWebState(
		(state) =>
			state.chatServer.activeUsers[
				getChatRoomIdentifier(uni_identifier, university)
			] || 0
	);

	const withNotificationsEnabled = useWebState(
		(state) =>
			state.chatServer.usersWithNotificationsEnabled[
				getChatRoomIdentifier(uni_identifier, university)
			] || 0
	);

	const beforeMessages = useWebState((state) =>
		getAvailableUnloadedChatMessages(state, university, uni_identifier)
	);

	const totalMessages = messagesToDisplay.length + beforeMessages;

	return (
		<Layout>
			<Left>
				{/* <DownloadBanner style={{marginTop: 20}}>
					Gib auch du deine Meinung ab!
				</DownloadBanner> */}
				<div style={{height: 20}} />
				{totalMessages > 0 ? (
					<Statistic>
						<Icon className="material-icons-two-tone">
							question_answer
						</Icon>
						{totalMessages} Nachrichten
					</Statistic>
				) : null}
				{activeUsers > 0 ? (
					<Statistic>
						<Icon className="material-icons-two-tone">person</Icon>
						{activeUsers} Nutzer kürzlich online
					</Statistic>
				) : null}
				{withNotificationsEnabled ? (
					<Statistic>
						<Icon className="material-icons-two-tone">
							notifications
						</Icon>
						{withNotificationsEnabled} haben Push-Nachrichten aktiviert
					</Statistic>
				) : null}
				<Statistic />
				<br />
				<BetaBadge>BETA</BetaBadge>
				<Beta>
					Die Chat-Ansicht auf dem Web ist in einer Beta-Version. <br />{' '}
					Nur die letzten 30 Nachrichten werden angezeigt, benutze die App
					um den gesamten Verlauf zu sehen und Nachrichten zu schreiben.
				</Beta>
			</Left>
			<div style={{width: 20}} />
			<Right>
				<div style={{height: 20}} />
				{messagesToDisplay.map((m) => {
					return (
						<ChatMessage
							key={m._id}
							university={university}
							uni_identifier={uni_identifier}
							message={m}
						/>
					);
				})}
			</Right>
			<ChatServerManager />
			<ChatRoomSubscription
				university={university}
				uni_identifier={uni_identifier}
			/>
		</Layout>
	);
};
