import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {Colors} from '../../../core/functions/Colors';
import {CreditHelpers} from '../../../core/functions/CreditHelpers';
import {getModuleId} from '../../../core/functions/get-module-id';
import {getUnreadMessages} from '../../../core/functions/get-unread-messages';
import {useAppState} from '../../../core/functions/use-app-state';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import {Credit} from '../../../core/models/credit';
import {isCreditActive} from '../api/is-credit-active';

const Label = styled(Text)`
	color: white;
	font-size: 12px;
`;

const Bubble = styled(View)`
	background-color: ${Colors.Blue};
	height: 20px;
	width: 20px;
	border-radius: 10px;
	justify-content: center;
	align-items: center;
`;

export const CreditCellUnreadBubble = (props: {credit: Credit}) => {
	const unreadMessages = useAppState((state) =>
		getUnreadMessages(
			state,
			getModuleId(props.credit) as string,
			CreditHelpers.getInstitution(props.credit)
		)
	);
	const language = useLanguage();
	const appearance = useAppearance();
	const isActive = isCreditActive(props.credit, language, appearance);
	if (!isActive) {
		return null;
	}

	if (unreadMessages.length === 0) {
		return null;
	}

	return (
		<Bubble>
			<Label>{unreadMessages.length}</Label>
		</Bubble>
	);
};
