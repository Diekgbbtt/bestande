import {View} from 'react-native';
import {Image, Text} from 'react-native-normalized';
import styled from 'styled-components/native';

export const Button = styled(View)<{
	color?: string;
	fill?: boolean;
}>`
	height: 32px;
	border-radius: 2px;
	border-color: ${(props) => props.color || props.theme.BLUE_TINT};
	background-color: ${(props) =>
		props.fill ? props.color || props.theme.BLUE_TINT : 'rgba(0, 0, 0, 0)'};
	border-width: 1px;
	align-items: center;
	padding-right: 10px;
	flex-direction: row;
`;

export const Label = styled(Text)<{
	fill?: boolean;
	color?: string;
}>`
	color: ${(props) =>
		props.fill ? 'white' : props.color || props.theme.BLUE_TINT};
	font-weight: bold;
	padding-left: 10px;
`;

export const IconContainer = styled(View)<{
	color: string;
}>`
	height: 100%;
	width: 30px;
	justify-content: center;
	align-items: center;
	background-color: ${(props) => props.color || props.theme.BLUE_TINT};
`;

export const Icon = styled(Image)<{
	color?: string;
}>`
	width: 18px;
	tint-color: ${(props) => (props.color ? props.color : 'white')};
	height: 18px;
`;
