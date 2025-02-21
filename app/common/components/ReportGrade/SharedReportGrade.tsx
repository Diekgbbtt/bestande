import {ScrollView} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components';
import {Base} from '../../../../core/components/Base';
import {Flexer} from '../../../../core/components/Primitives';

export const BlueButton = styled(Base)`
	background-color: ${(props) => props.theme.BLUE_TINT};
	justify-content: center;
`;

export const Scroller = styled(ScrollView)`
	padding-left: 12px;
	padding-right: 12px;
	padding-top: 12px;
`;

export const ReportGradeContainer = styled(Flexer)<{
	safeBottom: number;
}>`
	background-color: ${(props) => props.theme.BACKGROUND};
	padding-bottom: ${(props) => props.safeBottom}px;
`;

export const BlueButtonLabel = styled(Text)`
	color: white;
	font-weight: bold;
	text-align: center;
`;

export const Explainer = styled(Text)`
	text-align: center;
	color: ${(props) => props.theme.TITLE};
`;
