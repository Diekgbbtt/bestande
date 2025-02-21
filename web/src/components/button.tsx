import {HTMLProps} from 'react';
import styled, {css} from 'styled-components';
import {BLUE, RED} from '../../../core/models/colors';

type ButtonProps = {
	disabled?: boolean;
	destructive?: boolean;
};

const style = css<ButtonProps & any>`
	padding: 8px 16px;
	border: 0px solid ${BLUE};
	color: ${(props) =>
		props.disabled ? 'gray' : props.destructive ? RED : BLUE};
	border-radius: 2px;
	background: transparent;
	box-shadow: 0px 0px 0px 1px inset;
	font-size: 14px;
	font-weight: bold;
	cursor: pointer;
	-webkit-appearance: none;
`;

const Button = styled.button<ButtonProps>`
	${style};
`;

export const SubmitButton = styled.input.attrs({
	type: 'submit',
})<ButtonProps & HTMLProps<HTMLInputElement>>`
	${style};
`;

export default Button;
