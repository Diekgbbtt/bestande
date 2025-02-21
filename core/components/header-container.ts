import styled from 'styled-components';
import {mobile} from './layout/responsive';

export const HeaderContainer = styled.div`
	display: flex;
	${mobile`flex-direction: column`};
	margin-bottom: 10px;
`;

export const TextContainer = styled.div`
	flex: 1;
`;

export const ButtonContainer = styled.div`
	display: flex;
	${mobile`margin-top: 10px`};
	${mobile`margin-bottom: 10px`};
`;
