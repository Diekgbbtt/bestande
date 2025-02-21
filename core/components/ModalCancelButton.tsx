import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {Colors} from '../functions/Colors';
import {useLanguage} from '../functions/use-language';
import rawStrings from '../raw-strings';
import {UnifiedProgress} from './UnifiedProgress';

const CancelButton = styled(TouchableOpacity)`
	height: 60px;
`;

const Container = styled(View)`
	flex: 1;
	justify-content: center;
`;

const Label = styled(Text)<{
	disabled?: boolean;
	destructive?: boolean;
	bold?: boolean;
	color?: string;
}>`
	color: ${(props) =>
		props.disabled
			? 'rgba(0, 0, 0, 0.2)'
			: props.color
			? props.color
			: props.destructive
			? Colors.Red
			: props.theme.BLUE_TINT};
	font-size: 18px;
	text-align: center;
	font-weight: ${(props) => (props.bold ? 'bold' : 'normal')};
`;

export const ModalCancelButton = (props: {
	loading?: boolean;
	disabled?: boolean;
	destructive?: boolean;
	label?: string;
	style?: any;
	bold?: boolean;
	color?: string;
	onPress: () => void;
}) => {
	const language = useLanguage();
	return (
		<CancelButton {...props} disabled={props.loading || props.disabled}>
			<Container>
				{props.loading ? (
					<UnifiedProgress />
				) : (
					<Label
						bold={props.bold}
						disabled={props.disabled}
						color={props.color}
						destructive={props.destructive}
					>
						{props.label || rawStrings.CANCEL[language]}
					</Label>
				)}
			</Container>
		</CancelButton>
	);
};
