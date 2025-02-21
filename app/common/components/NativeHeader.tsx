import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components/native';

export const Container = styled(View)`
	flex-direction: row;
	background-color: ${(props) => props.theme.HEADER_BACKGROUND};
	border-bottom-width: ${StyleSheet.hairlineWidth}px;
	border-bottom-color: rgba(0, 0, 0, 0.3);
`;

export const Touchable = styled(TouchableOpacity)`
	flex: 1;
`;

export const Item = styled(View)`
	justify-content: center;
	align-items: center;
	flex-direction: row;
`;

export const Label = styled(Text)<{
	isSelected?: boolean;
}>`
	font-size: 15px;
	text-align: center;
	margin-top: 12px;
	margin-bottom: 15px;
	font-weight: bold;
	color: ${(props) =>
		props.isSelected ? 'white' : props.theme.HEADER_SUBTITLE_COLOR};
`;
