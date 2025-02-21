import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {ActivityIndicator, Text} from 'react-native-normalized';
import {useDispatch} from 'react-redux';
import styled from 'styled-components';
import {fetchPreviousMessages} from '../../../core/actions/chat-server-native';
import {getAvailableUnloadedChatMessages} from '../../../core/functions/available-unloaded-chat-messages';
import {Colors} from '../../../core/functions/Colors';
import {formatString} from '../../../core/functions/format-string';
import {isLoadingPreviousMessages} from '../../../core/functions/is-loading-previous-message';
import {useAppState} from '../../../core/functions/use-app-state';
import {useLanguage} from '../../../core/functions/use-language';
import {Institution} from '../../../core/models/credit';
import rawStrings from '../../../core/raw-strings';
import {IMessageWithQuotes} from '../../../core/types/types';
import {hasAnErrorLoadingPreviousMessages} from '../api/has-an-error-loading-previous-messages';

const Container = styled(View)`
	justify-content: center;
	align-items: center;
	margin-bottom: 10px;
	margin-top: 10px;
`;

const ErrorLabel = styled(Text)`
	text-align: center;
	color: ${Colors.Red};
`;

const LoadMoreButton = styled(Text)`
	letter-spacing: 0.5px;
	color: ${(props) => props.theme.SUBTITLE};
`;

const Button = styled(TouchableOpacity)`
	padding: 10px;
`;

type Props = {
	uni_identifier: string;
	university: Institution;
	firstMessage: IMessageWithQuotes;
};

export const LoadEarlierMessagesButton = ({
	uni_identifier,
	university,
	firstMessage,
}: Props) => {
	const dispatch = useDispatch();
	const language = useLanguage();
	const isLoading = useAppState((state) =>
		isLoadingPreviousMessages(state, university, uni_identifier)
	);
	const errorLoading = useAppState((state) =>
		hasAnErrorLoadingPreviousMessages(state, university, uni_identifier)
	);
	const availableUnloadedMessagesCount = useAppState((state) =>
		getAvailableUnloadedChatMessages(state, university, uni_identifier)
	);

	const onPress = React.useCallback(() => {
		dispatch(
			fetchPreviousMessages(
				uni_identifier,
				university,
				30,
				Number(firstMessage.createdAt),
				false
			)
		);
	}, [dispatch, firstMessage, uni_identifier, university]);
	if (availableUnloadedMessagesCount === 0) {
		return null;
	}

	return (
		<Container>
			<Button onPress={onPress}>
				{errorLoading ? (
					<ErrorLabel>
						{rawStrings.ERROR_LOADING_PREVIOUS_MESSAGES[language]}
					</ErrorLabel>
				) : isLoading ? (
					<ActivityIndicator />
				) : (
					<LoadMoreButton>
						{availableUnloadedMessagesCount === 1
							? rawStrings.LOAD_ONE_MORE_MESSAGE[language].toUpperCase()
							: formatString(
									rawStrings.LOAD_X_MORE_MESSAGES[language],
									String(availableUnloadedMessagesCount)
							  ).toUpperCase()}
					</LoadMoreButton>
				)}
			</Button>
		</Container>
	);
};
