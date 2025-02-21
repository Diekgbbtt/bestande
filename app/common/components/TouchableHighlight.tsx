import {TouchableHighlight as TH} from 'react-native';
import styled from 'styled-components/native';

export const TouchableHighlight = styled(TH).attrs({
	underlayColor: 'rgba(0, 0, 0, 0.1)',
})<{
	escapePadded?: boolean;
	underlayColor?: string;
}>`
	${(props) =>
		props.escapePadded
			? `
		padding-left: 12px;
		padding-right: 12px;
		margin-left: -12px;
		margin-right: -12px;
	`
			: ''};
`;
