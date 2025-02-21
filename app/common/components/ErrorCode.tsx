import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components';
import {ErrorWithStatusCode} from '../../../core/functions/api-request';

const Container = styled(View)`
	justify-content: center;
	align-items: center;
	flex: 1;
`;

const Code = styled(Text)`
	font-size: 36px;
	text-align: center;
`;

const Description = styled(Text)`
	margin-top: 10px;
`;

export const ErrorCode = (props: {error: ErrorWithStatusCode}) => {
	return (
		<Container>
			<Code>{props.error.statusCode}</Code>
			<Description>{props.error.message}</Description>
		</Container>
	);
};
