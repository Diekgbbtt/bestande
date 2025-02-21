import React, {useCallback} from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components';
import {
	Label as OptionLabel,
	Option,
	OptionContainer,
} from '../../../core/components/Options';
import {Spacer} from '../../../core/components/UI/Spacer';
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
	background-color: ${(props) => props.theme.NO_USERNAME_AVAILABLE_BG};
`;

const Label = styled(Text)`
	color: ${(props) => props.theme.SUBTITLE};
`;

const BoldLabel = styled(Text)`
	font-weight: bold;
`;

export const NoChatRulesAccepted = () => {
	const language = useLanguage();
	const navigation = useNavigationInNative();
	const appearance = useAppearance();

	const review = useCallback(() => {
		navigation.navigate('ChatRules');
	}, [navigation]);

	return (
		<Container
			// @ts-expect-error
			shadowColor={appearance.TITLE}
			shadowRadius={5}
			shadowOffset={{width: 0, height: 0}}
			shadowOpacity={0.2}
			elevation={3}
		>
			<BoldLabel>{rawStrings.ACCEPT_CHAT_RULES[language]}</BoldLabel>
			<Spacer />
			<Label>{rawStrings.CHAT_RULES_DESCRIPTION_1[language]}</Label>
			<View style={{height: 12}} />
			<OptionContainer>
				<Option onPress={review}>
					<OptionLabel>{rawStrings.REVIEW_CHAT_RULES[language]}</OptionLabel>
				</Option>
			</OptionContainer>
		</Container>
	);
};
