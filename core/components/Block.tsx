import isArray from 'lodash/isArray';
import React, {ReactNode} from 'react';
import {View} from 'react-native';
import styled from 'styled-components/native';
import {BlockText} from './BlockText';
import {BlockTextTitle} from './BlockTextTitle';

const Container = styled(View)<{
	comment?: boolean;
}>`
	margin-bottom: 12px;
	border-left-width: ${(props) => (props.comment ? 2 : 0)}px;
	padding-left: ${(props) => (props.comment ? 5 : 0)}px;
	border-color: ${(props) => props.theme.COMMENT};
`;

export const Block = (props: {
	comment?: boolean;
	text?: string | ReactNode;
	title: string;
}) => {
	if (!props.text) {
		return null;
	}

	if (isArray(props.text) && props.text.length === 0) {
		return null;
	}

	return (
		<Container comment={props.comment}>
			{props.title ? <BlockTextTitle>{props.title}</BlockTextTitle> : null}
			<BlockText text={props.text} comment={props.comment} italic={false} />
		</Container>
	);
};
