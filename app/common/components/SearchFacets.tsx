import {View} from 'react-native';
import styled from 'styled-components/native';

export const FacetContainer = styled(View)`
	background-color: ${(props) => props.theme.BACKGROUND};
	height: 40px;
`;

export const FacetToolbar = styled(View)`
	padding-left: 10px;
	padding-right: 10px;
	flex-direction: row;
`;
