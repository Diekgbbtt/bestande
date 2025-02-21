import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import {Alert as AlertModal} from 'react-native-normalized';
import {PushNotificationPermissions} from 'react-native-push-notification';
import {
	getNotificationSettings,
	subscribeToChannels,
	unsubscribeFromChannels,
} from '../functions/api';
import {
	Device,
	NotificationSettings,
	NotificationsState,
	UserNotificationPreference,
} from '../types/notifications-state';

const initialState: NotificationsState = {
	loadingSystemPermissionsState: false,
	permissions: null,
	notificationSettings: null,
	loadingNotificationSettings: false,
	errorFetchingNotificationSettings: null,
	isSwitchingSubscriptionStateForRoom: {},
	userPrefersNotificationsEnabled: 'yes',
	notificationToken: null,
	userDeniedPermissionDialog: false,
};

enum NotificationActionTypes {
	START_LOADING_SYSTEM_PERMISSIONS = 'START_LOADING_SYSTEM_PERMISSIONS',
	RECEIVE_SYSTEM_PERMISSIONS = 'RECEIVE_SYSTEM_PERMISSIONS',
	START_FETCHING_NOTIFICATION_SETTINGS = 'START_FETCHING_NOTIFICATION_SETTINGS',
	RECEIVE_NOTIFICATION_SETTINGS = 'RECEIVE_NOTIFICATION_SETTINGS',
	ERROR_GETTING_NOTIFICATION_SETTINGS = 'ERROR_GETTING_NOTIFICATION_SETTINGS',
	START_SUBSCRIBING_TO_CHANNELS = 'START_SUBSCRIBING_TO_CHANNELS',
	SUBSCRIBED_TO_CHANNELS = 'SUBSCRIBED_TO_CHANNELS',
	ERROR_SUSCRIBING_TO_CHANNELS = 'ERROR_SUSCRIBING_TO_CHANNELS',
	UNSUBSCRIBED_FROM_CHANNELS = 'UNSUBSCRIBED_FROM_CHANNELS',
	USER_SIGNALS_NOTIFICATION_PREFERENCE = 'USER_SIGNALS_NOTIFICATION_PREFERENCE',
	SET_NOTIFICATION_TOKEN = 'SET_NOTIFICATION_TOKEN',
	START_REGISTERING_DEVICE = 'START_REGISTERING_DEVICE',
	REGISTERED_DEVICE = 'REGISTERED_DEVICE',
}

type StartLoadingPermissions = {
	type: NotificationActionTypes.START_LOADING_SYSTEM_PERMISSIONS;
};

export const startLoadingPermissions = (): StartLoadingPermissions => {
	return {
		type: NotificationActionTypes.START_LOADING_SYSTEM_PERMISSIONS,
	};
};

type ReceiveSystemPermissions = {
	type: NotificationActionTypes.RECEIVE_SYSTEM_PERMISSIONS;
	permissions: PushNotificationPermissions;
	userDeniedPermissionDialog: boolean;
};

export const receiveSystemPermissions = (
	permissions: PushNotificationPermissions,
	userDeniedPermissionDialog: boolean
) => {
	return {
		type: NotificationActionTypes.RECEIVE_SYSTEM_PERMISSIONS,
		permissions,
		userDeniedPermissionDialog,
	};
};

type StartFetchingNotificationSettings = {
	type: NotificationActionTypes.START_FETCHING_NOTIFICATION_SETTINGS;
};

const startFetchingNotificationSettings = (): StartFetchingNotificationSettings => {
	return {
		type: NotificationActionTypes.START_FETCHING_NOTIFICATION_SETTINGS,
	};
};

type ReceiveNotificationSettings = {
	type: NotificationActionTypes.RECEIVE_NOTIFICATION_SETTINGS;
	notificationSettings: NotificationSettings;
};

const receiveNotificationSettings = (
	notificationSettings: NotificationSettings
): ReceiveNotificationSettings => {
	return {
		type: NotificationActionTypes.RECEIVE_NOTIFICATION_SETTINGS,
		notificationSettings,
	};
};

type ErrorReceivingNotificationSettings = {
	type: NotificationActionTypes.ERROR_GETTING_NOTIFICATION_SETTINGS;
	error: Error;
};

const errorReceivingNotificationSettings = (
	error: Error
): ErrorReceivingNotificationSettings => {
	return {
		type: NotificationActionTypes.ERROR_GETTING_NOTIFICATION_SETTINGS,
		error,
	};
};

export const loadNotificationSettings = (token: string) => {
	return async (dispatch) => {
		dispatch(startFetchingNotificationSettings());
		try {
			const settings = await getNotificationSettings(token);
			dispatch(receiveNotificationSettings(settings));
		} catch (err) {
			dispatch(errorReceivingNotificationSettings(err));
		}
	};
};

type StartSubscribeToChannelsRequest = {
	type: NotificationActionTypes.START_SUBSCRIBING_TO_CHANNELS;
	channels: string[];
};

const startSubscribingOrUnsubscribingToChannels = (
	channels: string[]
): StartSubscribeToChannelsRequest => {
	return {
		type: NotificationActionTypes.START_SUBSCRIBING_TO_CHANNELS,
		channels,
	};
};

type SubscribedToChannels = {
	type: NotificationActionTypes.SUBSCRIBED_TO_CHANNELS;
	channels: string[];
};

const subscribedToChannels = (channels: string[]): SubscribedToChannels => {
	return {
		type: NotificationActionTypes.SUBSCRIBED_TO_CHANNELS,
		channels,
	};
};

type UnsubscribedFromChannels = {
	type: NotificationActionTypes.UNSUBSCRIBED_FROM_CHANNELS;
	channels: string[];
};

const unsubscribedFromChannels = (channels: string[]) => {
	return {
		type: NotificationActionTypes.UNSUBSCRIBED_FROM_CHANNELS,
		channels,
	};
};

type ErrorSubscribingOrUnsubscribingToChannels = {
	type: NotificationActionTypes.ERROR_SUSCRIBING_TO_CHANNELS;
	error: Error;
	channels: string[];
};

const errorSubscribingOrUnsubscribingToChannels = (
	error: Error,
	channels: string[]
): ErrorSubscribingOrUnsubscribingToChannels => {
	return {
		type: NotificationActionTypes.ERROR_SUSCRIBING_TO_CHANNELS,
		error,
		channels,
	};
};

type UserSignalsNotificationPreference = {
	type: NotificationActionTypes.USER_SIGNALS_NOTIFICATION_PREFERENCE;
	prefersNotifications: UserNotificationPreference;
};

export const userSignalsNotificationPreference = (
	prefersNotifications: UserNotificationPreference
): UserSignalsNotificationPreference => ({
	type: NotificationActionTypes.USER_SIGNALS_NOTIFICATION_PREFERENCE,
	prefersNotifications,
});

export const subscribeToChannelsAction = (
	userHash: string,
	channels: string[]
) => {
	return async (dispatch) => {
		dispatch(startSubscribingOrUnsubscribingToChannels(channels));
		try {
			await subscribeToChannels(userHash, channels);
			dispatch(subscribedToChannels(channels));
		} catch (err) {
			// TRANSLATE
			AlertModal.alert('Could not subscribe to channel: ' + err.message);
			dispatch(errorSubscribingOrUnsubscribingToChannels(err, channels));
		}
	};
};

export const unsubscribeFromChannelsAction = (
	userHash: string,
	channels: string[]
) => {
	return async (dispatch) => {
		dispatch(startSubscribingOrUnsubscribingToChannels(channels));
		try {
			await unsubscribeFromChannels(userHash, channels);
			dispatch(unsubscribedFromChannels(channels));
		} catch (err) {
			// TRANSLATE
			AlertModal.alert('Could not unsubscribe from channel: ' + err.message);
			dispatch(errorSubscribingOrUnsubscribingToChannels(err, channels));
		}
	};
};

type SetNotificationToken = {
	type: NotificationActionTypes.SET_NOTIFICATION_TOKEN;
	token: string | null;
};

export const setNotificationToken = (
	token: string | null
): SetNotificationToken => ({
	type: NotificationActionTypes.SET_NOTIFICATION_TOKEN,
	token,
});

type RegisteredDevice = {
	type: NotificationActionTypes.REGISTERED_DEVICE;
	device: Device;
};

export const registeredDevice = (device: Device): RegisteredDevice => {
	return {
		type: NotificationActionTypes.REGISTERED_DEVICE,
		device,
	};
};

export const notifications = (
	state: NotificationsState = initialState,
	action:
		| StartLoadingPermissions
		| ReceiveSystemPermissions
		| StartFetchingNotificationSettings
		| ReceiveNotificationSettings
		| ErrorReceivingNotificationSettings
		| StartSubscribeToChannelsRequest
		| SubscribedToChannels
		| UnsubscribedFromChannels
		| ErrorSubscribingOrUnsubscribingToChannels
		| UserSignalsNotificationPreference
		| SetNotificationToken
		| RegisteredDevice
): NotificationsState => {
	switch (action.type) {
		case NotificationActionTypes.START_LOADING_SYSTEM_PERMISSIONS:
			return {
				...state,
				loadingSystemPermissionsState: true,
			};
		case NotificationActionTypes.RECEIVE_SYSTEM_PERMISSIONS:
			return {
				...state,
				loadingSystemPermissionsState: false,
				permissions: action.permissions,
				userDeniedPermissionDialog: action.userDeniedPermissionDialog,
			};
		case NotificationActionTypes.START_FETCHING_NOTIFICATION_SETTINGS:
			return {
				...state,
				loadingNotificationSettings: true,

				errorFetchingNotificationSettings: null,
			};
		case NotificationActionTypes.RECEIVE_NOTIFICATION_SETTINGS:
			return {
				...state,
				loadingNotificationSettings: false,
				notificationSettings: action.notificationSettings,
			};
		case NotificationActionTypes.ERROR_GETTING_NOTIFICATION_SETTINGS:
			return {
				...state,
				errorFetchingNotificationSettings: action.error,
				notificationSettings: null,
				loadingNotificationSettings: false,
			};
		case NotificationActionTypes.START_SUBSCRIBING_TO_CHANNELS: {
			return {
				...state,
				isSwitchingSubscriptionStateForRoom: {
					...state.isSwitchingSubscriptionStateForRoom,
					...action.channels.reduce((a, i) => ({...a, [i]: true}), {}),
				},
			};
		}

		case NotificationActionTypes.SUBSCRIBED_TO_CHANNELS: {
			return {
				...state,
				isSwitchingSubscriptionStateForRoom: {
					...state.isSwitchingSubscriptionStateForRoom,
					...action.channels.reduce((a, i) => ({...a, [i]: false}), {}),
				},
				notificationSettings: {
					devices: state.notificationSettings
						? state.notificationSettings.devices
						: [],
					pushSubscriptions: state.notificationSettings
						? uniq([
								...state.notificationSettings.pushSubscriptions,
								...action.channels,
						  ])
						: action.channels,
				},
			};
		}

		case NotificationActionTypes.ERROR_SUSCRIBING_TO_CHANNELS: {
			return {
				...state,

				isSwitchingSubscriptionStateForRoom: {
					...state.isSwitchingSubscriptionStateForRoom,
					...action.channels.reduce((a, i) => ({...a, [i]: false}), {}),
				},
			};
		}

		case NotificationActionTypes.UNSUBSCRIBED_FROM_CHANNELS: {
			return {
				...state,
				isSwitchingSubscriptionStateForRoom: {
					...state.isSwitchingSubscriptionStateForRoom,
					...action.channels.reduce((a, i) => ({...a, [i]: false}), {}),
				},
				notificationSettings: {
					devices: state.notificationSettings
						? state.notificationSettings.devices
						: [],
					pushSubscriptions: state.notificationSettings
						? state.notificationSettings.pushSubscriptions.filter(
								(p) => !action.channels.includes(p)
						  )
						: [],
				},
			};
		}

		case NotificationActionTypes.USER_SIGNALS_NOTIFICATION_PREFERENCE: {
			return {
				...state,
				userPrefersNotificationsEnabled: action.prefersNotifications,
			};
		}

		case NotificationActionTypes.SET_NOTIFICATION_TOKEN: {
			return {
				...state,
				notificationToken: action.token,
			};
		}

		case NotificationActionTypes.REGISTERED_DEVICE: {
			return {
				...state,
				notificationSettings: state.notificationSettings
					? {
							devices: uniqBy(
								[...state.notificationSettings.devices, action.device],
								(d) => d.notificationToken
							),
							pushSubscriptions: state.notificationSettings.pushSubscriptions,
					  }
					: {
							devices: [action.device],
							pushSubscriptions: [],
					  },
			};
		}

		default:
			return state;
	}
};
