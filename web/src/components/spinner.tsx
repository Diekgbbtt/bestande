import React from 'react';
import styled, {keyframes} from 'styled-components';
import {BLUE} from '../../../core/models/colors';

const rotate360 = keyframes`
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(-360deg);
	}
`;

const Wrapper = styled.div`
	display: flex;
	flex: 1;
	justify-content: center;
	align-items: center;
	padding-top: 50px;
	padding-bottom: 50px;
`;

type Props = {
	background?: string;
	color?: string;
};

const Content = styled.div<Props>`
	background: ${(props) => props.background || 'white'};
	border: 2px solid ${(props) => props.color || BLUE};
	display: inline-block;
	width: 16px;
	height: 16px;
	border-radius: 50%;
	position: relative;
	animation: ${rotate360} 1s linear infinite;
	&:after {
		content: '';
		background: ${(props) => props.background || 'white'};
		height: 6px;
		width: 6px;
		right: -3px;
		top: 50%;
		margin-top: -3px;
		position: absolute;
	}
`;

export const Spinner = (props: Props) => (
	<Wrapper>
		<Content {...props} />
	</Wrapper>
);
