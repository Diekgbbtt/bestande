import {View} from 'react-native';
import styled from 'styled-components/native';

export const Card = styled(View)<{
	transparent?: boolean;
	noPadBottom?: boolean;
	noPadTop?: boolean;
}>`
	background-color: ${(props) =>
		props.transparent ? 'transparent' : props.theme.BACKGROUND};
	padding-left: 12px;
	padding-right: 12px;
	padding-bottom: ${(props) => (props.noPadBottom ? 0 : 8)}px;
	padding-top: ${(props) => (props.noPadTop ? 0 : 12)}px;
`;

export const BigCard = styled(Card)`
	padding: 12px;
`;
