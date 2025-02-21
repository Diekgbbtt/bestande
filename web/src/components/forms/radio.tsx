import React from 'react';
import styled, {css} from 'styled-components';
import {mobile} from '../../../../core/components/layout/responsive';
import {BLUE} from '../../../../core/models/colors';

const RadioOuter = styled.div<{
	invert?: boolean;
	checked?: boolean;
}>`
	margin-top: -2px;
	border-radius: 50%;
	border: 2px solid;
	border-color: ${(props) =>
		props.checked
			? (p) => (p.invert ? 'rgba(255, 255, 255, 0.5)' : BLUE)
			: 'rgba(0, 0, 0, 0.2)'};
	width: 16px;
	padding: 2px;
	height: 16px;
	margin-right: 7px;
	display: inline-block;
	vertical-align: middle;
`;

const RadioInner = styled.div<{
	checked?: boolean;
	invert?: boolean;
}>`
	${(props) =>
		props.checked
			? css`
					background: ${props.invert ? 'white' : BLUE};
			  `
			: ''} width: 8px;
	height: 8px;
	border-radius: 50%;
`;

export const OptionHeader = styled.div`
	font-weight: bold;
	${mobile`
		padding-left: 14px;
	`};
`;

export const Radio = (props) => {
	return (
		<RadioOuter {...props}>
			<RadioInner {...props} />
		</RadioOuter>
	);
};
