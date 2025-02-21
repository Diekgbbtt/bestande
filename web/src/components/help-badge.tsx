import Tooltip from '@jonny/tooltip';
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
	height: 20px;
	width: 20px;
	position: relative;
	border-radius: 50%;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	font-size: 12px;
	color: rgba(0, 0, 0, 0.3);
	border: 1px solid rgba(0, 0, 0, 0.1);
	font-weight: bold;
	cursor: default;
`;

const ContentContainer = styled.div`
	font-size: 12px;
	padding-left: 8px;
	padding-right: 8px;
	text-transform: none;
	font-weight: normal;
`;

export const HelpBadge = ({content}) => (
	<Tooltip
		preferredPlacement="top"
		tip={<ContentContainer>{content}</ContentContainer>}
	>
		<span>
			<Container>?</Container>
		</span>
	</Tooltip>
);
