import React from 'react';
import styled from 'styled-components';
import {ErrorWithStatusCode} from '../../../core/functions/api-request';

const Code = styled.div`
	font-size: 40px;
	font-weight: 200;
`;

const Description = styled.div`
	font-size: 12px;
	margin-top: 10px;
`;

const Error = (props: {error: ErrorWithStatusCode}) => {
	const {error, ...otherProps} = props;
	const {statusCode, message} = error;
	return (
		<div {...otherProps}>
			<Code>{statusCode}</Code>
			<Description>{message}</Description>
		</div>
	);
};

export const ErrorCode = styled(Error)`
	display: flex;
	flex: 1;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;
