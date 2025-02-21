import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Image, Text} from 'react-native-normalized';
import styled from 'styled-components';
import {useAppearance} from '../../../core/functions/use-appearance';

const Touchable = styled(TouchableOpacity)``;

const Container = styled(View)<{
	noPadding?: boolean;
}>`
	flex-direction: row;
	padding-left: ${(props) => (props.noPadding ? 0 : 12)}px;
	padding-right: ${(props) => (props.noPadding ? 0 : 12)}px;
	padding-top: 8px;
	padding-bottom: 8px;
	align-items: center;
`;

const Arrow = styled(Image).attrs({
	source: require('../assets/arrow-forward.png'),
})`
	tint-color: ${(props) => props.theme.ICON_TINT};
	height: 20px;
	width: 20px;
`;

const Cell = styled(View)`
	height: 32px;
	flex: 3;
	justify-content: center;
`;

const Label = styled(Text)`
	margin-left: 10px;
	color: ${(props) => props.theme.SUBTITLE};
`;

export const ForwardArrowButton = (props: {
	icon?: NodeRequire;
	text: string;
	onPress?: () => void;
	noPadding?: boolean;
}) => {
	const {text, icon, ...otherProps} = props;
	const appearance = useAppearance();
	const content = (
		<Container {...otherProps} style={{backgroundColor: appearance.BACKGROUND}}>
			{icon ? (
				<Arrow source={icon} />
			) : (
				<Arrow source={require('../assets/arrow-forward.png')} />
			)}
			<Cell>
				<Label>{text}</Label>
			</Cell>
		</Container>
	);
	if (props.onPress) {
		return <Touchable onPress={props.onPress}>{content}</Touchable>;
	}

	return content;
};
