import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {TextInput, TouchableOpacity, View} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {ActivityIndicator, Alert, Text} from 'react-native-normalized';
import {useDispatch} from 'react-redux';
import styled from 'styled-components/native';
import {UsernameAvailabilityReport} from '../../../core/actions/chat-server';
import {AnimatedNativeScrollView} from '../../../core/components/AnimatedScrollView';
import {Base, Content} from '../../../core/components/Base';
import {Dismisser} from '../../../core/components/Dismisser';
import {SafeSideSpace} from '../../../core/components/SafeSideSpace';
import {Config} from '../../../core/data/Config';
import {setChatUsername, usernameCheck} from '../../../core/functions/api';
import {canChangeUsername} from '../../../core/functions/can-change-username';
import {Colors} from '../../../core/functions/Colors';
import {getUserHash} from '../../../core/functions/get-user-hash';
import {isUsernameValid} from '../../../core/functions/is-username-valid';
import {useAppState} from '../../../core/functions/use-app-state';
import {useAppearance} from '../../../core/functions/use-appearance';
import {useLanguage} from '../../../core/functions/use-language';
import {usePull} from '../../../core/functions/use-pull';
import rawStrings from '../../../core/raw-strings';
import {
	errorSettingUsername,
	startSettingUsername,
	userNameSet,
} from '../../../core/reducers/users';
import {didAcceptChatRules} from '../actions/chat-rules';
import {FatModalTitle} from './FatModalTitle';
import {UsernameAvailabilityView} from './UsernameAvailabilityView';

const Container = styled(AnimatedNativeScrollView).attrs({
	contentContainerStyle: {
		padding: 12,
		paddingTop: 30,
	},
})`
	flex: 1;
	background-color: ${(props) => props.theme.BACKGROUND};
`;

const Explainer = styled(Text)`
	text-align: center;
`;

const Input = styled(TextInput)`
	font-size: 18px;
	padding-top: 0;
	padding-bottom: 0;
	flex: 1;
	text-align: center;
`;

const InputContainer = styled(Content)`
	flex-direction: row;
	flex: 1;
`;

const UsernameSuggestionContainer = styled(TouchableOpacity)`
	padding: 10px;
`;

const UsernameSuggestionLabel = styled(Text)`
	font-size: 15px;
`;

const UsernameSuggestions = styled(View)`
	${Config.IS_WEB_APP ? '' : 'flex: 0;'}
	flex-wrap: wrap;
	justify-content: center;
	flex-direction: row;
`;

type UsernameAvailabilityState = {
	loading: boolean;
	report: UsernameAvailabilityReport | null;
	err: Error | null;
};

const Spacer = styled(View)<{
	height: number;
}>`
	height: ${(props) => props.height}px;
`;

const JustifiedBase = styled(View)`
	justify-content: center;
`;

const ConfirmText = styled(Text)`
	font-weight: bold;
	text-align: center;
`;

export const UsernamePicker = () => {
	const dispatch = useDispatch();
	const navigation = useNavigation();

	const hasAcceptedRules = useAppState((state) => didAcceptChatRules(state));
	const userProfile = useAppState((state) => state.users.userProfile);
	const [username, setUsername] = useState('');
	const randomUsernames = useAppState(
		(state) => state.users.usernameSuggestions
	);
	const token = useAppState((state) => getUserHash(state, null));
	const isSettingUsername = useAppState(
		(state) => state.users.isSettingUsername
	);
	const language = useLanguage();

	const [
		userNameAvailabilityState,
		setUsernameAvailabilityState,
	] = useState<UsernameAvailabilityState>({
		loading: false,
		report: null,
		err: null,
	});

	const appearance = useAppearance();

	const usernameValidationError = isUsernameValid(
		username,
		userProfile ? userProfile.username : null,
		language
	);

	const dismisser = usePull({
		pixelsNeeded: 100,
		onPull: () => {
			navigation.goBack();
		},
	});

	useEffect(() => {
		if (usernameValidationError) {
			return;
		}

		setUsernameAvailabilityState((prevReport) => ({
			loading: true,
			// This is not correct actually, but looks better.
			// Server side validation will take care of the edge cases
			report: prevReport.report,
			err: prevReport.err,
		}));
		usernameCheck(username)
			.then(({data}) => {
				setUsernameAvailabilityState({
					loading: false,
					report: data,
					err: null,
				});
			})
			.catch((err) => {
				setUsernameAvailabilityState({
					loading: false,
					report: null,
					err,
				});
			});
	}, [username, usernameValidationError]);

	const canSetUsername =
		!usernameValidationError &&
		userNameAvailabilityState.report &&
		userNameAvailabilityState.report.available;

	const hasWaitedLongEnough = canChangeUsername(userProfile);

	return (
		<Container {...dismisser.scrollViewProps}>
			<SafeSideSpace>
				<Dismisser progress={dismisser.progress} />

				<FatModalTitle>
					{userProfile
						? rawStrings.CHANGE_USERNAME[language]
						: rawStrings.CHOOSE_YOUR_USERNAME[language]}
				</FatModalTitle>
				{hasWaitedLongEnough ? (
					<>
						<Spacer height={16} />
						<Explainer style={{color: appearance.SUBTITLE}}>
							{rawStrings.USERNAME_PICK_DESCRIPTION[language]}
						</Explainer>
						<Spacer height={24} />

						<Base>
							<InputContainer>
								<Input
									placeholder={rawStrings.YOUR_USERNAME[language]}
									value={username}
									placeholderTextColor={appearance.SUBTITLE}
									autoCapitalize="none"
									style={{
										color: appearance.TITLE,
									}}
									onChangeText={(text) => {
										setUsername(text);
									}}
								/>
							</InputContainer>
						</Base>
						<Spacer height={12} />
						{username === '' ? (
							<Explainer> </Explainer>
						) : usernameValidationError ? (
							<Explainer style={{color: Colors.Red}}>
								{usernameValidationError}
							</Explainer>
						) : (
							<>
								{userNameAvailabilityState.report ? (
									<Explainer>
										<UsernameAvailabilityView
											report={userNameAvailabilityState.report}
										/>
									</Explainer>
								) : // I suspect bug that 'loading' property is not proper
								userNameAvailabilityState.loading ? (
									<Explainer> </Explainer>
								) : (
									<Explainer> </Explainer>
								)}
								{userNameAvailabilityState.err ? (
									<Explainer
										style={{
											color: Colors.Red,
										}}
									>
										{rawStrings.ERROR[language]}:{' '}
										{userNameAvailabilityState.err.message}
									</Explainer>
								) : null}
							</>
						)}
						<Spacer height={12} />
						<Explainer style={{color: appearance.SUBTITLE}}>
							{rawStrings.USER_NAME_SUGGESTIONS_DESC[language]}
						</Explainer>
						<Spacer height={4} />
						<UsernameSuggestions>
							{randomUsernames.map((name) => (
								<View key={name}>
									<UsernameSuggestionContainer
										onPress={() => {
											setUsername(name);
										}}
									>
										<UsernameSuggestionLabel
											style={{color: appearance.BLUE_TINT}}
										>
											{name}
										</UsernameSuggestionLabel>
									</UsernameSuggestionContainer>
								</View>
							))}
						</UsernameSuggestions>
						<Spacer height={12} />
						<TouchableOpacity
							disabled={!canSetUsername}
							onPress={() => {
								dispatch(startSettingUsername());
								setChatUsername({
									token,
									username,
									appVersion: DeviceInfo.getVersion(),
									language,
								})
									.then(({data}) => {
										dispatch(userNameSet(data));
										if (hasAcceptedRules) {
											navigation.goBack();
										} else {
											navigation.goBack();
											setTimeout(() => {
												navigation.navigate('ChatRules', {});
											}, 1000);
										}
									})
									.catch((err) => {
										Alert.alert(
											`${rawStrings.ERROR[language]}: ${err.message}`
										);
										dispatch(errorSettingUsername(err));
									});
							}}
						>
							<JustifiedBase
								style={{
									backgroundColor: isSettingUsername
										? appearance.BASE_COLOR
										: canSetUsername
										? appearance.BLUE_TINT
										: appearance.BASE_COLOR,
									borderRadius: 50,
								}}
							>
								<Content style={{justifyContent: 'center', height: 50}}>
									{isSettingUsername ? (
										<ActivityIndicator />
									) : (
										<ConfirmText
											style={{
												color: canSetUsername ? 'white' : appearance.SUBTITLE,
											}}
										>
											{rawStrings.CONFIRM_USERNAME[language]}
										</ConfirmText>
									)}
								</Content>
							</JustifiedBase>
						</TouchableOpacity>
					</>
				) : (
					<>
						<Spacer height={12} />
						<Explainer>
							{rawStrings.HAVE_TO_WAIT_FOR_USERNAME_CHANGE[language]}
						</Explainer>
						<Spacer height={80} />
					</>
				)}
				<Spacer height={20} />
			</SafeSideSpace>
		</Container>
	);
};
