import {AppState, Platform, PlatformOSType} from 'react-native';
import PushNotification, {
	PushNotificationPermissions,
} from 'react-native-push-notification';
import {Dispatch} from 'redux';
import {registerNotificationToken} from '../../../core/functions/api';
import {Institution} from '../../../core/models/credit';
import {
	registeredDevice,
	setNotificationToken,
} from '../../../core/reducers/notifications';
import {NotificationEvents} from './NotificationEvents';

export const configurePush = ({
	dispatch,
	userHash,
}: {
	dispatch: Dispatch<any>;
	userHash: string;
}) => {
	PushNotification.configure({
		onRegister: (notificationToken) => {
			registerNotificationToken({
				token: userHash,
				notificationToken: notificationToken.token,
				platform: notificationToken.os,
			})
				.then(() => {
					dispatch(
						registeredDevice({
							notificationToken: notificationToken.token,
							platform: notificationToken.os as PlatformOSType,
						})
					);
				})
				.catch(() => {
					console.log('did not register');
				});
			dispatch(setNotificationToken(notificationToken.token));
		},
		onNotification: (notification) => {
			console.log('NOTIFICATION:', notification, notification.data);
			if (Platform.OS === 'ios') {
				notification.finish('UIBackgroundFetchResultNoData');
			}

			const data = notification.data as {
				uni_identifier?: string;
				university?: Institution;
			};
			if (!notification.foreground) {
				if (PushNotification.clearAllNotifications && Platform.OS === 'ios') {
					PushNotification.clearAllNotifications();
				}

				NotificationEvents.emit('new-notification', data);
			} else if (AppState.currentState === 'inactive') {
				NotificationEvents.emit('new-notification', data);
			}
		},
		// TODO: Upgrade push notification library
		// @ts-expect-error
		senderID: '832412145438',
		permissions: {
			// iOS only
			alert: true,
			badge: true,
			sound: true,
		},
		popInitialNotification: true,
		requestPermissions: false,
	});
};

export const checkPushNotificationPermissions = (
	callback: (permissions: PushNotificationPermissions) => void
) => {
	PushNotification.checkPermissions(callback);
};
