import React from 'react';
import {Platform, View} from 'react-native';
import {Image, Text} from 'react-native-normalized';
import styled from 'styled-components';

const Container = styled(View)`
	background-color: ${(props) => props.theme.CHAT_PREVIEW_SYSTEM_MESSAGE};
	padding-horizontal: 6px;
	margin-left: 5px;
	border-radius: 12px;
	padding-top: 4px;
	padding-bottom: 4px;
	flex-direction: row;
	justify-content: center;
`;

export const TabBadgeLabel = styled(Text)`
	color: white;
	font-size: 12px;
	font-weight: bold;
`;

export const TabBadgeIcon = styled(Image)`
	height: 13px;
	width: 13px;
	tint-color: white;
	margin-right: 2px;
	margin-top: ${Platform.OS === 'android' ? 2 : 0}px;
`;
export const TabBadge = (props) => {
	return <Container>{props.children}</Container>;
};
