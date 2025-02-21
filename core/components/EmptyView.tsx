import React from 'react';
import {ImageURISource, View} from 'react-native';
import {Image, Text} from 'react-native-normalized';
import styled from 'styled-components/native';

const Container = styled(View)`
	flex: 1;
	justify-content: center;
	align-items: center;
`;

const Icon = styled(Image)`
	height: 60px;
	width: 60px;
	tint-color: ${(props) => props.theme.ICON_TINT};
`;

const Label = styled(Text)`
	font-size: 12px;
	color: ${(props) => props.theme.SUBTITLE};
	text-align: center;
`;

const Spacer = styled(View)`
	height: 8px;
`;

export const EmptyView = ({
	icon,
	text,
}: {
	icon: ImageURISource;
	text: string;
}) => {
	return (
		<Container>
			<Icon source={icon} />
			<Spacer />
			<Label>{text}</Label>
		</Container>
	);
};
