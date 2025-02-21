import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Image, Text} from 'react-native-normalized';
import styled from 'styled-components';
import {Colors} from '../../../core/functions/Colors';
import {useLanguage} from '../../../core/functions/use-language';
import rawStrings from '../../../core/raw-strings';

const Container = styled(TouchableOpacity)`
	padding-top: 6px;
	padding-bottom: 6px;
`;

const Icon = styled(Image)`
	tint-color: ${Colors.Red};
	height: 16px;
	width: 16px;
`;

const Label = styled(Text)`
	color: ${Colors.Red};
	margin-left: 16px;
`;

const ReviewDelete = (props: {disabled?: boolean; onPress: () => void}) => {
	const language = useLanguage();
	return (
		<Container disabled={props.disabled} onPress={props.onPress}>
			<View style={{flexDirection: 'row'}}>
				<Icon source={require('../assets/trash-square.png')} />
				<Label>{rawStrings.DELETE[language]}</Label>
			</View>
		</Container>
	);
};

export default ReviewDelete;
