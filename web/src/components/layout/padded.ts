import styled from 'styled-components';

const Padded = styled.div<{
	horizontal?: boolean;
}>`
	padding: ${(props) => (props.horizontal ? 0 : '10px')} 12px;
	width: 100%;
`;

export const EscapePadded = styled.div<{
	horizontal?: boolean;
}>`
	margin-left: -12px;
	margin-right: -12px;
	margin-top: ${(props) => (props.horizontal ? 0 : -10)}px;
`;

export const ShadedEscapePadded = styled(EscapePadded)`
	padding: 12px;
	background: rgba(0, 0, 0, 0.05);
`;

export default Padded;
