import {Text} from 'react-native-normalized';
import styled from 'styled-components';

const Title = styled(Text)<{
	white?: boolean;
}>`
	font-size: 16px;
	color: ${(props) => (props.white ? 'white' : 'black')};
	line-height: 24px;
	flex: 1;
	font-weight: bold;
	${(props) =>
		props.white
			? `	
		text-shadow-offset: 1px 1px;
		text-shadow-color: rgba(0, 0, 0, 0.4);
	`
			: ''};
`;

export default Title;
