import AsyncStorage from '@react-native-community/async-storage';
import partition from 'lodash/partition';
import React, {useEffect} from 'react';
import {ScrollView, View} from 'react-native';
import {useDispatch} from 'react-redux';
import styled from 'styled-components/native';
import {VSpace} from '../../../core/components/Base';
import {CellWithSwitch} from '../../../core/components/CellWithSwitch';
import {SafeSideSpace} from '../../../core/components/SafeSideSpace';
import {CreditHelpers} from '../../../core/functions/CreditHelpers';
import {getVisibleCredits} from '../../../core/functions/Credits';
import {getChatRoomIdentifier} from '../../../core/functions/get-chat-room-identifier';
import {getModuleId} from '../../../core/functions/get-module-id';
import {getUniqueIdentifier} from '../../../core/functions/get-unique-identifier';
import {getUserHash} from '../../../core/functions/get-user-hash';
import {useAppState} from '../../../core/functions/use-app-state';
import {useLanguage} from '../../../core/functions/use-language';
import rawStrings from '../../../core/raw-strings';
import {
	loadNotificationSettings,
	subscribeToChannelsAction,
	unsubscribeFromChannelsAction,
	userSignalsNotificationPreference,
} from '../../../core/reducers/notifications';
import {isCreditBooked} from '../api/is-credit-booked';
import {isDeviceRegistered} from '../api/is-device-registered';
import {CreditNotificationSettings} from './CreditNotificationSettings';
import {Header} from './Header';
import {SettingsTitle} from './SettingsTitle';

const Container = styled(ScrollView)`
	padding: 12px;
	background-color: ${(props) => props.theme.BACKGROUND};
`;

const NotificationSettings = () => {
	const hasSystemPermission = useAppState(
		(state) => state.notifications.permissions?.alert
	);
	const deviceRegistered = useAppState((state) => isDeviceRegistered(state));
	const userPrefersNotifications = useAppState(
		(state) => state.notifications.userPrefersNotificationsEnabled
	);
	const userDeniedPermissionDialog = useAppState(
		(state) => state.notifications.userDeniedPermissionDialog
	);
	const subscriptions = useAppState((state) =>
		state.notifications.notificationSettings
			? state.notifications.notificationSettings.pushSubscriptions
			: []
	);
	const notificationsAreEnabled =
		hasSystemPermission &&
		deviceRegistered &&
		userPrefersNotifications !== 'explicitly-no' &&
		subscriptions.length > 0;
	const dispatch = useDispatch();
	const token = useAppState((state) => getUserHash(state, null));
	const notificationSettingsState = useAppState((state) => state.notifications);
	const language = useLanguage();
	const {notificationSettings} = notificationSettingsState;
	const credits = useAppState((state) => getVisibleCredits(state));
	const [activeCredits, inactiveCredits] = partition(credits, (c) =>
		isCreditBooked(c)
	);
	useEffect(() => {
		dispatch(loadNotificationSettings(token));
	}, [dispatch, token]);
	return (
		<Container keyboardShouldPersistTaps="always">
			<SafeSideSpace>
				<CellWithSwitch
					text={rawStrings.NOTIFICATIONS_ENABLED[language]}
					enabled={Boolean(notificationsAreEnabled)}
					disabled={userDeniedPermissionDialog || credits.length === 0}
					onChange={(val) => {
						dispatch(
							userSignalsNotificationPreference(
								val ? 'explicitly-yes' : 'explicitly-no'
							)
						);
						AsyncStorage.setItem('prefersNotifications', String(val))
							.then(() => {
								// noop
							})
							.catch((err) => {
								console.log('could not set prefersNotification', err);
							});
						if (deviceRegistered && hasSystemPermission && val) {
							dispatch(
								subscribeToChannelsAction(
									token,
									activeCredits.map((a) =>
										getChatRoomIdentifier(
											getModuleId(a) as string,
											CreditHelpers.getInstitution(a)
										)
									)
								)
							);
						} else if (deviceRegistered && !val) {
							dispatch(
								unsubscribeFromChannelsAction(
									token,
									notificationSettings?.pushSubscriptions as string[]
								)
							);
						}
					}}
					loading={false}
				/>
				<VSpace />
				{userDeniedPermissionDialog ? (
					<Header
						text={
							rawStrings
								.CANNOT_ENABLE_NOTIFICATIONS_BECAUSE_OF_DENIED_PERMISSIONS[
								language
							]
						}
					/>
				) : null}
				{credits.length === 0 ? (
					<Header text={rawStrings.NO_CREDITS_NO_NOTIFICATIONS[language]} />
				) : null}
				{notificationSettings ? (
					<>
						{activeCredits.length > 0 ? (
							<>
								<SettingsTitle>
									{rawStrings.ACTIVE_COURSES[language]}
								</SettingsTitle>
								{activeCredits.map((c, i) => {
									return (
										<View key={getUniqueIdentifier(c)}>
											<CreditNotificationSettings
												inCreditConfiguration={false}
												credit={c}
											/>
											{i !== credits.length - 1 ? <VSpace /> : null}
										</View>
									);
								})}
								<VSpace />
							</>
						) : null}
						{inactiveCredits.length > 0 ? (
							<>
								<SettingsTitle>
									{rawStrings.INACTIVE_COURSES[language]}
								</SettingsTitle>
								{inactiveCredits.map((c, i) => {
									return (
										<View key={getUniqueIdentifier(c)}>
											<CreditNotificationSettings
												inCreditConfiguration={false}
												credit={c}
											/>
											{i !== credits.length - 1 ? <VSpace /> : null}
										</View>
									);
								})}
								<VSpace />
							</>
						) : null}
					</>
				) : null}
			</SafeSideSpace>
		</Container>
	);
};

export default NotificationSettings;
