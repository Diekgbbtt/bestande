import {PlatformOSType} from 'react-native';

interface PushNotificationPermissions {
	alert?: boolean;
	badge?: boolean;
	sound?: boolean;
}

export type Device = {
	platform: PlatformOSType;
	notificationToken: string;
};

export type NotificationSettings = {
	pushSubscriptions: string[];
	devices: Device[];
};

export type UserNotificationPreference =
	| 'yes'
	| 'explicitly-yes'
	| 'explicitly-no';

export type NotificationsState = {
	loadingSystemPermissionsState: boolean;
	permissions: PushNotificationPermissions | null;
	notificationSettings: NotificationSettings | null;
	errorFetchingNotificationSettings: Error | null;
	loadingNotificationSettings: boolean;
	isSwitchingSubscriptionStateForRoom: {[key: string]: boolean};
	userPrefersNotificationsEnabled: UserNotificationPreference;
	notificationToken: string | null;
	userDeniedPermissionDialog: boolean;
};
