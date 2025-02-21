import differenceInHours from 'date-fns/differenceInHours';
import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components';
import {
	ChatMessage,
	SystemMessageMetadata,
	SystemMessageType,
} from '../../../core/actions/chat-server';
import {
	CheckItem,
	Label as BaseLabel,
	VSpace,
} from '../../../core/components/Base';
import {Colors} from '../../../core/functions/Colors';
import {daysAndHours} from '../../../core/functions/days-and-hours';
import {TabIndex} from '../../../core/functions/get-chat-room-identifier';
import {globalStyles} from '../../../core/functions/styles';
import {useLanguage} from '../../../core/functions/use-language';
import {useNavigationInNative} from '../../../core/functions/useNavigationInNative';
import {AppLanguage} from '../../../core/models/app-language';
import {Credit} from '../../../core/models/credit';
import rawStrings from '../../../core/raw-strings';

const Label = styled(Text)`
	color: ${(props) => props.theme.SUBTITLE};
	font-size: 13px;
	margin-bottom: 8px;
`;

const ReturnLabel = styled(Text)`
	color: ${(props) => props.theme.SUBTITLE};
	font-size: 13px;
	margin-top: 1px;
`;

const ExamReturnedLabelContainer = styled(View)`
	background-color: ${Colors.Green};
	padding: 3px;
	padding-left: 6px;
	padding-right: 6px;
	margin-top: 2px;
	margin-bottom: 2px;
	border-radius: 3px;
`;

const ExamReturnedLabel = styled(Text)`
	font-weight: bold;
	color: white;
`;

const ReturnContainer = styled(View)`
	border-width: 1px;
	border-radius: 2px;
	border-color: ${(props) => props.theme.BORDER_COLOR};
	padding: 10px;
	margin-bottom: 4px;
`;

const Row = styled(View)`
	flex: 1;
	flex-direction: row;
	align-items: center;
`;

export const getPlainTextSystemMessage = (
	msg: ChatMessage,
	language: AppLanguage
) => {
	const systemMessageMetadata = msg.systemMessageMetadata as SystemMessageMetadata;
	if (systemMessageMetadata.type === SystemMessageType.EXAM_RETURNED) {
		return rawStrings.GRADES_ANNOUNCED[language];
	}

	if (systemMessageMetadata.type === SystemMessageType.USERNAME_CHANGE) {
		if (language === 'de') {
			return `${systemMessageMetadata.oldUsername} hat den Username geändert und heisst jetzt ${systemMessageMetadata.newUsername}`;
		}

		return `${systemMessageMetadata.oldUsername} changed their username to ${systemMessageMetadata.newUsername}`;
	}
};

export const BestandeSystemMessage = (props: {
	msg: ChatMessage;
	credit: Credit | null;
	goToTab: (tab: TabIndex) => void;
}) => {
	const language = useLanguage();
	const {credit} = props;
	const navigation = useNavigationInNative();
	const systemMessageMetadata = props.msg
		.systemMessageMetadata as SystemMessageMetadata;

	if (systemMessageMetadata.type === SystemMessageType.EXAM_RETURNED) {
		const difference = differenceInHours(
			systemMessageMetadata.examReturn.return_date,
			systemMessageMetadata.examReturn.exam_date
		);
		const days = Math.floor(difference / 24);
		const hours = difference - days * 24;

		const isAdded =
			credit &&
			credit.status !== 'NOT_BOOKED' &&
			credit.status !== 'UNKNOWN_STATUS';

		return (
			<ReturnContainer>
				<Row>
					<ExamReturnedLabelContainer>
						<ExamReturnedLabel>
							{rawStrings.GRADES_ANNOUNCED[language]}
						</ExamReturnedLabel>
					</ExamReturnedLabelContainer>
				</Row>
				<ReturnLabel>
					{rawStrings.RETURN_TIME[language]}:{' '}
					{daysAndHours(days, hours, language)}
				</ReturnLabel>
				<ReturnLabel>
					{rawStrings.REPORTED_BY[language]}{' '}
					{systemMessageMetadata.examReturn.reporter?.username}
				</ReturnLabel>
				<VSpace />
				<CheckItem
					onPress={() => {
						props.goToTab('statistics');
					}}
				>
					<BaseLabel>{rawStrings.STATISTICS[language]}</BaseLabel>
				</CheckItem>
				{isAdded && credit ? (
					<>
						<VSpace />
						<CheckItem
							onPress={() => {
								navigation.navigate('CreditConfiguration', {
									credit,
									showAddedIndicator: false,
								});
							}}
						>
							<BaseLabel>{rawStrings.ENTER_GRADE[language]}</BaseLabel>
						</CheckItem>
					</>
				) : null}
				<VSpace />
			</ReturnContainer>
		);
	}

	if (systemMessageMetadata.type === SystemMessageType.USERNAME_CHANGE) {
		return (
			<Label>
				<Label style={globalStyles.bold}>
					{systemMessageMetadata.oldUsername}
				</Label>{' '}
				{rawStrings.CHANGED_THEIR_USERNAME[language]}{' '}
				<Label style={globalStyles.bold}>
					{systemMessageMetadata.newUsername}
				</Label>
			</Label>
		);
	}

	return null;
};
