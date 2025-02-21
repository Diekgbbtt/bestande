import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components';
import {useAppState} from '../../../core/functions/use-app-state';
import {Institution} from '../../../core/models/credit';
import {User} from '../../../core/types/user-state';
import {didAcceptChatRules} from '../actions/chat-rules';
import {NoChatRulesAccepted} from './NoChatRulesAccepted';
import {NoUsernameInputReplacement} from './NoUsernameInputReplacement';

const ZeroHeight = styled(View)`
	height: 0;
`;

export const ChatBottom: React.FC<{
	uni_identifier: string;
	university: Institution;
	userProfile: User | null;
	text: string;
	onTextChanged: (text: string) => void;
	onSend: (text: string) => void;
	goToStatistic: () => void;
}> = ({
	uni_identifier,
	userProfile,
	onSend,
	onTextChanged,
	text,
	university,
	goToStatistic,
}) => {
	const acceptedChatRules = useAppState((state) => didAcceptChatRules(state));

	if (uni_identifier === 'all') {
		return <ZeroHeight />;
	}

	if (!userProfile) {
		return <NoUsernameInputReplacement />;
	}

	if (acceptedChatRules) {
		return null;
	}

	return <NoChatRulesAccepted />;
};
