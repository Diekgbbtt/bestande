import {
	NavigationProp,
	useNavigation,
	useScrollToTop,
} from '@react-navigation/native';
import React, {useCallback, useRef} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {email as composeEmail} from 'react-native-communications';
import DeviceInfo from 'react-native-device-info';
import {Alert, Text} from 'react-native-normalized';
import Rate, {AndroidMarket} from 'react-native-rate';
import {useDispatch} from 'react-redux';
import styled from 'styled-components/native';
import {setInstitution} from '../../../core/actions/institution';
import {doLogout} from '../../../core/actions/logout';
import {
	Base,
	BaseTouchable,
	CheckItem,
	Content,
	Label as BaseLabel,
	VSpace,
} from '../../../core/components/Base';
import {SafeSideSpace} from '../../../core/components/SafeSideSpace';
import {Config} from '../../../core/data/Config';
import {RN5Routes} from '../../../core/data/rn5-routes';
import {Colors} from '../../../core/functions/Colors';
import {globalStyles} from '../../../core/functions/styles';
import {useAppState} from '../../../core/functions/use-app-state';
import {useAppearance} from '../../../core/functions/use-appearance';
import {Institution} from '../../../core/models/credit';
import {UZH} from '../../../core/models/university';
import rawStrings from '../../../core/raw-strings';
import {globalNavigate} from '../api/set-master-navigator';
import {AppearanceSwitcher} from './AppearanceSwitcher';
import {ExternalLink} from './ExternalLink';
import {GradeOptSwitch} from './GradeOptSwitch';
import {Header} from './Header';
import {LanguageSwitcher} from './LanguageSwitcher';
import {MensaPricing} from './MensaPricing';
import {SettingsTitle} from './SettingsTitle';
import SocialMedia from './SocialMedia';
import {YourUsernameRow} from './YourUsernameRow';
import {ZurichAnimation} from './ZurichAnimation';

const Container = styled(ScrollView)`
	flex: 1;
`;

const TopTitle = styled(View)`
	padding: 12px;
	padding-bottom: 0;
`;

const BoldButtonLabel = styled(Text)`
	font-weight: bold;
	color: ${(props) => props.theme.BUTTON_LABEL_COLOR};
`;

const HeaderMb = styled(Header)`
	margin-bottom: 10px;
`;

const styles = StyleSheet.create({
	pt10: {
		paddingTop: 10,
	},
	pt6: {
		paddingTop: 6,
	},
	p12: {
		padding: 12,
	},
	mb10: {
		marginBottom: 10,
	},
});

const SettingsView = () => {
	const dispatch = useDispatch();
	const isDev = useAppState(
		(state) => state.multiLogin.UZH.username === 'bestande'
	);
	const userState = useAppState((state) => state.users);
	const uzhLogin = useAppState((state) => state.multiLogin.UZH);
	const institution = useAppState((state) => state.institution.institution);
	const languageRedux = useAppState((state) => state.language.selectedLanguage);
	const navigation = useNavigation<NavigationProp<RN5Routes, 'SettingsView'>>();

	const onChangelog = useCallback(() => {
		navigation.navigate('Changelog');
	}, [navigation]);

	const ref = useRef<ScrollView>(null);
	useScrollToTop(ref);
	const appearance = useAppearance();

	return (
		<Container
			ref={ref}
			keyboardShouldPersistTaps="always"
			style={{backgroundColor: appearance.BACKGROUND}}
		>
			<SafeSideSpace>
				<TopTitle>
					<SettingsTitle>
						{rawStrings.HOME_INSTITUTION[languageRedux]}
					</SettingsTitle>
				</TopTitle>
			</SafeSideSpace>
			<ZurichAnimation
				institution={institution}
				onChange={(i: Institution) => {
					dispatch(setInstitution(i));
				}}
			/>
			<SafeSideSpace>
				<View style={styles.p12}>
					<VSpace />
					<CheckItem
						noCheck
						onPress={() => {
							globalNavigate('Search', {});
						}}
					>
						<BaseLabel>{rawStrings.ADD_MODULE[languageRedux]}</BaseLabel>
					</CheckItem>
					<VSpace />
					{uzhLogin.loggedIn ? (
						<CheckItem
							style={globalStyles.flex1}
							noCheck
							onPress={() => {
								Alert.alert(
									rawStrings.CLEAR_IMPORTED_UZH_DATA[languageRedux],
									rawStrings.SURE_TO_CLEAR_UZH_DATA[languageRedux],
									[
										{
											text: rawStrings.CANCEL[languageRedux],
											onPress: () => {
												// noop
											},
										},
										{
											text: rawStrings.DELETE[languageRedux],
											style: 'destructive',
											onPress: () => {
												dispatch(doLogout(UZH));
											},
										},
									]
								);
							}}
						>
							<BaseLabel
								style={{
									color: Colors.Red,
								}}
							>
								{rawStrings.CLEAR_IMPORTED_UZH_DATA[languageRedux]}
							</BaseLabel>
						</CheckItem>
					) : null}
					<VSpace />
					<SettingsTitle>{rawStrings.CHAT[languageRedux]}</SettingsTitle>
					<YourUsernameRow />
					<VSpace />
					{userState.userProfile ? (
						<>
							<VSpace />
							<TouchableOpacity
								onPress={() => {
									navigation.navigate('NotificationSettings');
								}}
							>
								<Base padded>
									<Content>
										<BoldButtonLabel>
											{rawStrings.NOTIFICATION_SETTINGS[languageRedux]}
										</BoldButtonLabel>
									</Content>
								</Base>
							</TouchableOpacity>
						</>
					) : null}
					<VSpace />

					<TouchableOpacity
						onPress={() => {
							globalNavigate('ChatRules');
						}}
					>
						<Base padded>
							<Content>
								<BoldButtonLabel>
									{rawStrings.CHAT_RULES[languageRedux]}
								</BoldButtonLabel>
							</Content>
						</Base>
					</TouchableOpacity>
					<VSpace />
					<SettingsTitle>
						{rawStrings.MENSA_PRICES[languageRedux]}
					</SettingsTitle>
					<View style={styles.pt6}>
						<MensaPricing />
					</View>
					<VSpace />
					<VSpace />
					<SettingsTitle>
						{rawStrings.GRADE_STATISTICS[languageRedux]}
					</SettingsTitle>
					<View style={styles.pt6}>
						<GradeOptSwitch />
					</View>
					<Header text={rawStrings.GRADE_OPT_EXPLAINER[languageRedux]} />

					<VSpace />
					<VSpace />
					<SettingsTitle>{rawStrings.LANGUAGE[languageRedux]}</SettingsTitle>
					<View style={styles.pt10}>
						<LanguageSwitcher />
					</View>
					<VSpace />
					<VSpace />
					<SettingsTitle>{rawStrings.APPEARANCE[languageRedux]}</SettingsTitle>

					<View style={styles.pt10}>
						<AppearanceSwitcher />
					</View>
					<Header text={rawStrings.APPEARANCE_EXPLAINER[languageRedux]} />
					<VSpace />
					<VSpace />
					<SettingsTitle>{`Bestande v${DeviceInfo.getVersion()}`}</SettingsTitle>
					<ExternalLink
						text={rawStrings.CONTACT[languageRedux]}
						url="mailto:info@bestande.ch"
						onPress={() => {
							composeEmail(['info@bestande.ch'], null, null, null, null);
						}}
					/>

					{Config.RATE_APP_STORE ? (
						<>
							<VSpace />
							<TouchableOpacity
								onPress={() => {
									const options = {
										AppleAppID: '1058948091',
										GooglePackageName: 'bestande.bestande',
										OtherAndroidURL:
											'https://play.google.com/store/apps/details?id=bestande.bestande&hl=de_CH',
										preferredAndroidMarket: AndroidMarket.Google,
										preferInApp: false,
										openAppStoreIfInAppFails: true,
										fallbackPlatformURL:
											'https://play.google.com/store/apps/details?id=bestande.bestande&hl=de_CH',
									};
									Rate.rate(options, (success) => {
										if (success) {
											console.log('success');
										}
									});
								}}
							>
								<Base padded>
									<Content>
										<BaseLabel>
											{rawStrings.RATE_AT_THE_STORE[languageRedux]}
										</BaseLabel>
									</Content>
								</Base>
							</TouchableOpacity>
						</>
					) : null}
					<VSpace />

					<TouchableOpacity onPress={onChangelog}>
						<Base padded>
							<Content>
								<BoldButtonLabel>
									{rawStrings.CHANGELOG[languageRedux]}
								</BoldButtonLabel>
							</Content>
						</Base>
					</TouchableOpacity>
					<VSpace />
					<ExternalLink text="www.bestande.ch" url="https://bestande.ch" />
					{isDev ? (
						<>
							<VSpace />
							<BaseTouchable
								padded
								onPress={() => {
									navigation.navigate('DevMenu');
								}}
							>
								<Content>
									<BaseLabel>Entwicklermenu</BaseLabel>
								</Content>
							</BaseTouchable>
						</>
					) : null}
					<VSpace />
					<VSpace />
					<VSpace />
					<SettingsTitle>Social Media</SettingsTitle>
					<VSpace />
					<SocialMedia />
					<HeaderMb text={rawStrings.SUPPORT_US[languageRedux]} />
					<VSpace />
					<VSpace />

					{/**

				<Button
					title="crash"
					onPress={() => {
						throw new Error('Crash ooops');
					}}
				/>

				<LoginContainer />
		 */}
				</View>
			</SafeSideSpace>
		</Container>
	);
};

export default SettingsView;
