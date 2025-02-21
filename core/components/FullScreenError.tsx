import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {uiKit} from '../functions/ui-kit';
import {useAppearance} from '../functions/use-appearance';
import {useLanguage} from '../functions/use-language';
import rawStrings from '../raw-strings';

const Container = styled(View)`
	flex: 1;
	justify-content: center;
	align-items: center;
`;

const ErrorMessage = styled(Text)`
	text-align: center;
`;

export const FullScreenError = (props: {error: string}) => {
	const language = useLanguage();
	const appearance = useAppearance();
	return (
		<Container style={{backgroundColor: appearance.BACKGROUND}}>
			<Text style={[uiKit.subheadEmphasizedObject, {color: appearance.TITLE}]}>
				{rawStrings.ERROR[language]}
			</Text>
			<ErrorMessage style={{color: appearance.TITLE}}>
				{props.error}
			</ErrorMessage>
		</Container>
	);
};
