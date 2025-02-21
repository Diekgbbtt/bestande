import React from 'react';
import {View} from 'react-native';
import {MarkdownView} from 'react-native-markdown-view';
import styled from 'styled-components/native';
import {openLink} from '../../../core/functions/open-link';
import {useAppearance} from '../../../core/functions/use-appearance';
import {markdownStyles} from '../styles/markdown';

const Container = styled(View)<{
	background?: string;
}>`
	background-color: ${(props) =>
		props.background ? props.background : 'white'};
	padding: 12px;
	border-radius: 10px;
	margin-bottom: 5px;
`;

const WarningContainer = (props: {background?: string; warning: string}) => {
	const appearance = useAppearance();
	return (
		<Container background={props.background}>
			<MarkdownView
				styles={markdownStyles(appearance)}
				onLinkPress={(link: string) => {
					openLink(link);
				}}
			>
				{props.warning.trim()}
			</MarkdownView>
		</Container>
	);
};

export default WarningContainer;
