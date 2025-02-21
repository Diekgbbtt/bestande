import {View} from 'react-native';
import {TextInput} from 'react-native-normalized';
import styled from 'styled-components/native';

export const SearchViewInputField = styled(TextInput)`
	height: 40px;
	font-size: 14px;
	padding-left: 10px;
	color: white;
	text-align: left;
	background-color: rgba(0, 0, 0, 0.2);
	border-radius: 6px;
`;

export const SearchViewInputContainer = styled(View)`
	background-color: ${(props) => props.theme.HEADER_BACKGROUND};
	padding: 8px;
`;
