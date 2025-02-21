import {View} from 'react-native';
import styled from 'styled-components/native';

export const SearchDivider = styled(View)`
	height: 14px;
	width: 1px;
	margin-left: 8px;
	margin-right: 8px;
	background-color: ${(props) => props.theme.BORDER_COLOR};
`;
