import {Image} from 'react-native-normalized';
import styled from 'styled-components/native';

export const FactIcon = styled(Image)<{
	light?: boolean;
}>`
	height: 16px;
	width: 16px;
	margin-right: 10px;
	align-self: center;
	margin-left: -1px;
	tint-color: ${(props) => (props.light ? 'white' : 'gray')};
`;
