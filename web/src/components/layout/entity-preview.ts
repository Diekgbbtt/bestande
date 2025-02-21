import {darken} from 'polished';
import styled from 'styled-components';
import Padded from './padded';

export const Wrapper = styled.div<{
	passive?: boolean;
}>`
	color: black;
	${(props) =>
		props.passive
			? null
			: `	
		&:hover {
			background: ${darken(0.1, '#ffffff')};
			border: 1px solid ${darken(0.1, '#ffffff')};
		}
	`} flex-direction: row;
	display: flex;
	margin-bottom: 4px;
	border: 1px solid ${darken(0.2, '#ffffff')};
`;

export const InnerWrapper = styled(Padded)`
	display: flex;
	align-items: center;
	padding-top: 8px;
	padding-bottom: 8px;
	font-size: 14px;
`;

export const Icon = styled.div`
	color: gray;
`;
