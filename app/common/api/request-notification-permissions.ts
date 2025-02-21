import PushNotification, {
	PushNotificationPermissions,
} from 'react-native-push-notification';

export const requestNotificationPermissions = async (): Promise<PushNotificationPermissions> => {
	await PushNotification.requestPermissions(['alert', 'sound', 'badge']);
	return new Promise((resolve) => {
		PushNotification.checkPermissions((permissions) => {
			resolve(permissions);
		});
	});
};
