import {darken} from 'polished';
import {css} from 'styled-components';
import {BLUE} from '../../../core/models/colors';

export const linkStyle = css`
	font-weight: bold;
	color: ${BLUE};
	&:active {
		color: ${darken(0.1, BLUE)};
	}
`;
