import {Image} from 'react-native-normalized';
import styled from 'styled-components';

const HEIGHT = 45;

export const Avatar = styled(Image)<{
	size: number;
}>`
	height: ${(props) => props.size || HEIGHT}px;
	width: ${(props) => props.size || HEIGHT}px;
	border-radius: ${(props) => (props.size || HEIGHT) / 2}px;
`;
