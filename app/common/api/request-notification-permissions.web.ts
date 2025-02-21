import type {PushNotificationPermissions} from 'react-native-push-notification';

// ts-unused-exports:disable-next-line
export const requestNotificationPermissions = async (): Promise<PushNotificationPermissions> =>
	Promise.resolve({
		alert: false,
		badge: false,
		sound: false,
	});
