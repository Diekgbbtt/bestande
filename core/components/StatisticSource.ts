import {Text} from 'react-native-normalized';
import styled from 'styled-components/native';

export const StatisticSource = styled(Text)`
	color: ${(props) => props.theme.SUBTITLE};
	font-size: 10px;
`;

export const SourceNumberText = styled(Text)`
	font-size: 10px;
	margin-top: 1px;
	margin-left: 2px;
	position: relative;
	color: ${(props) => props.theme.SUBTITLE};
`;
