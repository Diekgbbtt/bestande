import React, {useCallback} from 'react';
import {SafeAreaView} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components';
import {VSpace} from '../../../../core/components/Base';
import {Button, ButtonLabel} from '../../../../core/components/BigButton';
import {Flexer} from '../../../../core/components/Primitives';
import {useLanguage} from '../../../../core/functions/use-language';
import {useNavigationInNative} from '../../../../core/functions/useNavigationInNative';
import rawStrings from '../../../../core/raw-strings';

const Container = styled(Flexer)`
	background-color: ${(props) => props.theme.BACKGROUND};
	justify-content: center;
	padding: 12px;
`;

const Label = styled(Text)`
	color: ${(props) => props.theme.TITLE};
	text-align: center;
`;

export const NoUsernameEmptyView: React.FC = () => {
	const language = useLanguage();
	const navigation = useNavigationInNative();

	const openUsernamePicker = useCallback(() => {
		navigation.navigate('UsernamePicker');
	}, [navigation]);

	return (
		<Container>
			<SafeAreaView>
				<Label>{rawStrings.TO_UPLOAD_FILES_MUST_SET_USERNAME[language]}</Label>
				<VSpace />
				<VSpace />
				<VSpace />

				<Button onPress={openUsernamePicker}>
					<ButtonLabel>{rawStrings.CHOOSE_YOUR_USERNAME[language]}</ButtonLabel>
				</Button>
			</SafeAreaView>
		</Container>
	);
};
