import {Text} from 'react-native-normalized';
import styled from 'styled-components/native';

export const FatModalTitle = styled(Text)`
	text-align: center;
	font-weight: bold;
	font-size: 20px;
	color: ${(props) => props.theme.TITLE};
`;
