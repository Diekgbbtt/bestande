import React from 'react';
import {Platform, useWindowDimensions, View} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {getChatRoomIdentifier} from '../../../core/functions/get-chat-room-identifier';
import {truthy} from '../../../core/functions/truthy';
import {useAppState} from '../../../core/functions/use-app-state';
import {useLanguage} from '../../../core/functions/use-language';
import {Institution} from '../../../core/models/credit';
import rawStrings from '../../../core/raw-strings';
import {ApiResponse} from '../../../core/reducers/api';
import {ApiResponseState} from '../../../core/types/api-reducer-state';
import {formatPeopleCount} from '../api/format-people-count';
import {getApiResponse} from '../api/get-api-response';

const Container = styled(View)`
	justify-content: center;
	align-items: ${Platform.OS === 'android' ? 'flex-start' : 'center'};
`;

const Title = styled(Text)`
	color: white;
	font-size: 16px;
	font-weight: bold;
`;

const Subtitle = styled(Text)`
	font-size: 12px;
	color: white;
`;

const CreditCodeText = styled(Text)`
	color: rgba(255, 255, 255, 0.7);
	font-weight: normal;
`;

const CreditCode = (props: {apiResponse: ApiResponse}) => {
	if (
		!props.apiResponse ||
		!props.apiResponse.courseCode ||
		!props.apiResponse.courseCode.display
	) {
		return null;
	}

	// Extra space at the end to
	return (
		<CreditCodeText>
			{props.apiResponse.courseCode.series}{' '}
			{props.apiResponse.courseCode.identifier}{' '}
		</CreditCodeText>
	);
};

export const CreditViewTitle = (props: {
	uni_identifier: string;
	institution: Institution;
}) => {
	const dim = useWindowDimensions();
	const landscape = dim.width > dim.height;
	const apiResponse = useAppState((state) =>
		getApiResponse(state, props.institution, props.uni_identifier)
	) as ApiResponseState;
	const language = useLanguage();
	const connected = useAppState((state) => state.chatServer.connected);
	const activeUsers = useAppState(
		(state) =>
			state.chatServer.activeUsers[
				getChatRoomIdentifier(props.uni_identifier, props.institution)
			] || 0
	);
	const formattedNumber = formatPeopleCount(apiResponse);

	if (!apiResponse || !apiResponse.details) {
		return null;
	}

	const stringsToDisplay = connected
		? [
				formattedNumber
					? `${formattedNumber} ${rawStrings.APP_USERS[language]}`
					: null,
				activeUsers
					? `${activeUsers} ${rawStrings.RECENTLY_ONLINE[language]}`
					: null,
		  ].filter(truthy)
		: [rawStrings.CONNECTING[language]];
	return (
		<Container>
			<Title numberOfLines={1}>
				<CreditCode apiResponse={apiResponse.details} />
				{apiResponse.details.short_name}
			</Title>
			{stringsToDisplay.length > 0 && !landscape ? (
				<Subtitle>{stringsToDisplay.join(' ∙ ')}</Subtitle>
			) : null}
		</Container>
	);
};
