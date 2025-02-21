import {darken} from 'polished';
import {TouchableHighlight} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {Colors} from '../functions/Colors';

export const Button = styled(TouchableHighlight).attrs({
	underlayColor: darken(0.1, Colors.Blue),
})`
	background-color: ${(props) => props.theme.BLUE_TINT};
	padding: 15px 12px;
	border-radius: 3px;
`;

export const ButtonLabel = styled(Text)<{
	light?: boolean;
}>`
	color: white;
	font-weight: bold;
	align-self: center;
	${(props) =>
		props.light
			? `
		font-size: 12;
		opacity: 0.7;
	`
			: null};
`;
