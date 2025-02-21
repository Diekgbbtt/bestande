import styled, {css} from 'styled-components';
import {mobile} from '../../../core/components/layout/responsive';
import {BLUE} from '../../../core/models/colors';

export type RadioButtonProps = {
	checked?: boolean;
};

export const leftTouchable = css<RadioButtonProps & any>`
	padding-left: 14px;
	margin-left: -14px;
	border-radius: 2px;
	&:hover {
		background: rgba(0, 0, 0, 0.05);
	}
	padding-top: 4px;
	padding-bottom: 4px;
	${mobile`
		margin-left: 0;
		border-radius: 0;
		padding-top: 6px;
		padding-bottom: 6px;
	`};
	display: block;
	color: black;
	cursor: pointer;
	${(props) =>
		props.checked
			? `
		background: ${BLUE};
		color: white;
		&:hover {
			background: ${BLUE};
			color: white;			
		}
	`
			: ''};
`;

export const RadioLabel = styled.div<RadioButtonProps>`
	${leftTouchable};
`;
