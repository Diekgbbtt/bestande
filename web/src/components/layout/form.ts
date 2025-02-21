import styled from 'styled-components';
import {desktop, mobile} from '../../../../core/components/layout/responsive';

export const FieldContainer = styled.div`
	display: flex;
	${mobile`
		display: block;
	`};
`;

export const FieldLeft = styled.div`
	flex: 2;
`;

export const FieldRight = styled.div`
	flex: 1;
	${desktop`	
		padding-left: 12px;
		padding-top: 32px;
	`};
`;
