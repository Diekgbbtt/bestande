import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components';
import {
	Label as OptionLabel,
	Option,
	OptionContainer,
} from '../../../core/components/Options';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import {useNavigationInNative} from '../../../core/functions/useNavigationInNative';
import rawStrings from '../../../core/raw-strings';

const Container = styled(View)`
	align-items: center;
	justify-content: center;
	padding-top: 10px;
	padding-bottom: 15px;
	padding-left: 20px;
	padding-right: 20px;
`;

const Label = styled(Text)`
	color: ${(props) => props.theme.SUBTITLE};
	text-align: center;
`;

export const NoUsernameInputReplacement = () => {
	const language = useLanguage();
	const appearance = useAppearance();
	const navigation = useNavigationInNative();
	return (
		<Container
			style={{backgroundColor: appearance.NO_USERNAME_AVAILABLE_BG}}
			// @ts-expect-error
			shadowColor={appearance.TITLE}
			shadowRadius={5}
			shadowOffset={{width: 0, height: 0}}
			shadowOpacity={0.2}
			elevation={3}
		>
			<Label>{rawStrings.NO_USERNAME_PROMPT_1[language]}</Label>
			<Label>{rawStrings.NO_USERNAME_PROMPT_2[language]}</Label>
			<View style={{height: 12}} />
			<OptionContainer>
				<Option
					onPress={() => {
						navigation.navigate('UsernamePicker');
					}}
				>
					<OptionLabel>{rawStrings.CHOOSE_YOUR_USERNAME[language]}</OptionLabel>
				</Option>
			</OptionContainer>
		</Container>
	);
};
