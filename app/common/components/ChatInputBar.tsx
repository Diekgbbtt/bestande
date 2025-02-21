import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components';
import {Row} from '../../../core/components/Primitives';
import {Spacer} from '../../../core/components/UI/Spacer';
import {globalStyles} from '../../../core/functions/styles';
import {Institution} from '../../../core/models/credit';
import {ChatComposer} from './ChatComposer';
import {ChatMoreButton} from './ChatMoreButton';
import {ChatSendButton} from './ChatSendButton';

const Container = styled(Row)`
	padding: 8px;
	border-top-width: 1px;
	border-top-color: ${(props) => props.theme.BORDER_COLOR};
	align-items: flex-start;
	background-color: ${(props) => props.theme.BACKGROUND};
`;

export const ChatInputBar: React.FC<{
	text: string;
	uni_identifier: string;
	university: Institution;
	onTextChanged: (text: string) => void;
	onSend: (text: string) => void;
	goToStatistic: () => void;
}> = ({
	text,
	onTextChanged,
	onSend,
	uni_identifier,
	university,
	goToStatistic,
}) => {
	return (
		<Container>
			<ChatMoreButton
				uni_identifier={uni_identifier}
				university={university}
				goToStatistic={goToStatistic}
			/>
			<Spacer />
			<View style={globalStyles.flex1}>
				<ChatComposer text={text} onTextChanged={onTextChanged} />
			</View>
			{text.trim().length > 0 ? (
				<>
					<Spacer />
					<ChatSendButton text={text} onSend={onSend} />
				</>
			) : null}
		</Container>
	);
};
