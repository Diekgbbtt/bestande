import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Image, Text} from 'react-native-normalized';
import {useDispatch} from 'react-redux';
import styled from 'styled-components/native';
import {AnimatedNativeScrollView} from '../../../core/components/AnimatedScrollView';
import {Base, Content} from '../../../core/components/Base';
import {Dismisser} from '../../../core/components/Dismisser';
import {SafeSideSpace} from '../../../core/components/SafeSideSpace';
import {globalStyles} from '../../../core/functions/styles';
import {useAppState} from '../../../core/functions/use-app-state';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import {usePull} from '../../../core/functions/use-pull';
import rawStrings from '../../../core/raw-strings';
import {acceptChatRules, didAcceptChatRules} from '../actions/chat-rules';

const Outer = styled(AnimatedNativeScrollView)`
	flex: 1;
	background-color: ${(props) => props.theme.BACKGROUND};
`;

const Container = styled(View)`
	justify-content: center;
	padding-top: 40px;
	padding-left: 12px;
	padding-right: 12px;
	padding-bottom: 36px;
`;

const Paragraph = styled(Text)`
	line-height: 21px;
	font-size: 15px;
	color: ${(props) => props.theme.TITLE};
`;

const Icon = styled(Image)`
	height: 32px;
	width: 32px;
	margin-right: 16px;
	tint-color: ${(props) => props.theme.BLUE_TINT};
	margin-top: 5px;
`;

const Row = styled(View)`
	flex-direction: row;
	margin-bottom: 20px;
`;

const Bold = styled(Text)`
	font-weight: bold;
`;

const Title = styled(Bold)`
	color: ${(props) => props.theme.TITLE};
`;

const Spacer = styled(View)`
	height: 20px;
`;

export const ChatRules = () => {
	const acceptedChatRules = useAppState((state) => didAcceptChatRules(state));
	const dispatch = useDispatch();
	const appearance = useAppearance();
	const language = useLanguage();

	const navigation = useNavigation();
	const dismisser = usePull({
		pixelsNeeded: 100,
		onPull: () => {
			navigation.goBack();
		},
	});

	return (
		<Outer {...dismisser.scrollViewProps}>
			<Dismisser progress={dismisser.progress} />
			<SafeSideSpace>
				<Container>
					<Paragraph>{rawStrings.THESE_ARE_CHAT_RULES[language]}</Paragraph>
					<Spacer />
					<Row>
						<Icon source={require('../assets/comment_alt_smile_duotone.png')} />
						<View style={globalStyles.flex1}>
							<Paragraph>
								<Title>{rawStrings.TOPIC[language]}</Title>
								{'\n'}
								{rawStrings.KEEP_DISCUSSION_FOCUSED[language]}
							</Paragraph>
						</View>
					</Row>
					<Row>
						<Icon
							source={require('../assets/comment_alt_exclamation_duotone.png')}
						/>
						<View style={globalStyles.flex1}>
							<Paragraph>
								<Title>{rawStrings.PROHIBITED_MESSAGES[language]}</Title>
								{'\n'}
								{rawStrings.PROHIBITED_MESSAGES_LIST[language]}
							</Paragraph>
						</View>
					</Row>
					<Row>
						<Icon source={require('../assets/gavel_duotone.png')} />
						<View style={globalStyles.flex1}>
							<Paragraph>
								<Title>{rawStrings.MODERATION[language]}</Title>
								{'\n'}
								{rawStrings.MODERATION_TEXT[language]}
							</Paragraph>
						</View>
					</Row>
					<TouchableOpacity
						disabled={acceptedChatRules}
						onPress={() => {
							if (!acceptedChatRules) {
								setTimeout(() => {
									dispatch(acceptChatRules());
								}, 50);
								navigation.goBack();
							}
						}}
					>
						<Base
							style={{
								backgroundColor: acceptedChatRules
									? appearance.BASE_COLOR
									: appearance.BLUE_TINT,
								justifyContent: 'center',
							}}
						>
							<Content>
								<Bold
									style={{
										color: acceptedChatRules ? appearance.SUBTITLE : 'white',
									}}
								>
									{acceptedChatRules
										? rawStrings.ACCEPTED[language]
										: rawStrings.ACCEPT[language]}
								</Bold>
							</Content>
						</Base>
					</TouchableOpacity>
				</Container>
			</SafeSideSpace>
		</Outer>
	);
};
