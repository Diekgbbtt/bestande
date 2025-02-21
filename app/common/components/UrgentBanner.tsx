import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {Colors} from '../../../core/functions/Colors';
import {openLink} from '../../../core/functions/open-link';

const Container = styled(View)`
	background-color: ${Colors.Red};
	margin: 12px;
	border-radius: 3px;
`;

const Touchable = styled(TouchableOpacity)`
	padding: 12px;
`;

const Label = styled(Text)`
	color: white;
	font-weight: bold;
`;

export const UrgentBanner = (props: {text: string; link: string}) => {
	return (
		<Container>
			<Touchable
				onPress={() => {
					openLink(props.link);
				}}
			>
				<Label>{props.text}</Label>
			</Touchable>
		</Container>
	);
};
