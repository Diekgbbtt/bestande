import React, {useCallback} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Image} from 'react-native-normalized';
import styled from 'styled-components';

const Outer = styled(View)`
	padding: 10px;
	border-radius: 30px;
`;

const Icon = styled(Image)`
	height: 20px;
	width: 20px;
	tint-color: ${(props) => props.theme.SUBTITLE};
`;

interface SendProps {
	onSend: (text: string) => void;
	text: string;
}

export const ChatSendButton: React.FC<SendProps> = (props) => {
	const {onSend, text} = props;

	const onPress = useCallback(() => {
		onSend(text.trim());
	}, [onSend, text]);

	return (
		<TouchableOpacity accessible accessibilityLabel="send" onPress={onPress}>
			<Outer>
				<Icon source={require('../assets/paper_plane_solid.png')} />
			</Outer>
		</TouchableOpacity>
	);
};
