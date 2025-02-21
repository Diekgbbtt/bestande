import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components/native';

export const ResultContainer = styled(View)`
	padding-left: 16px;
	padding-right: 10px;
	padding-bottom: 8px;
	padding-top: 8px;
	background-color: ${(props) => props.theme.BACKGROUND};
	border-bottom-width: ${StyleSheet.hairlineWidth}px;
	border-bottom-color: ${(props) => props.theme.BORDER_COLOR};
`;

export const ResultTitle = styled(Text)``;

const ResultSubtitleText = styled(Text)`
	color: ${(props) => props.theme.SUBTITLE};
	font-size: 13px;
	margin-top: 2px;
`;

export const ResultSubtitle = (props: {children: string}) => {
	if (!props.children) {
		return null;
	}

	return <ResultSubtitleText {...props} />;
};
