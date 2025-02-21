import {lighten} from 'polished';
import styled from 'styled-components';
import {GREEN} from '../../../../core/models/colors';

export const SubmitButton = styled.input`
	background: ${GREEN};
	width: 100%;
	padding-top: 12px;
	padding-bottom: 12px;
	outline: none;
	font-family: Montserrat;
	font-size: 16px;
	cursor: pointer;
	border: none;
	&:hover {
		background: ${lighten(0.05, GREEN)};
	}
	&:active {
		border: none;
		background: ${lighten(0.1, GREEN)};
	}
	color: white;
`;
