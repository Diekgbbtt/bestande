import styled, {css} from 'styled-components';
import {BLUE} from '../../../../core/models/colors';

const formCss = css`
	border: 2px solid rgba(0, 0, 0, 0.1);
	outline: none;
	width: 100%;
	padding: 8px;
	font-size: 15px;
	font-family: Montserrat;
	&:focus {
		border-color: ${BLUE};
	}
`;

export const Textarea = styled.textarea`
	${formCss};
	resize: vertical;
	min-height: 200px;
`;

export const Input = styled.input`
	${formCss};
	margin-bottom: 10px;
`;
