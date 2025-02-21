import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {getUserHash} from '../../../core/functions/get-user-hash';
import {useActiveState} from '../../../core/functions/use-active-state';
import {useAppState} from '../../../core/functions/use-app-state';
import {
	loadNotificationSettings,
	receiveSystemPermissions,
	startLoadingPermissions,
} from '../../../core/reducers/notifications';
import {
	checkPushNotificationPermissions,
	configurePush,
} from '../api/configure-push';
import {requestNotificationPermissions} from '../api/request-notification-permissions';

export const PushNotificationManager = () => {
	const userHash = useAppState((state) => getUserHash(state, null));

	const userPrefersNotifications = useAppState(
		(state) => state.notifications.userPrefersNotificationsEnabled
	);

	const activeState = useActiveState();

	const dispatch = useDispatch();
	useEffect(() => {
		configurePush({dispatch, userHash});
	}, [userHash, dispatch]);

	useEffect(() => {
		const requestPermission = async () => {
			try {
				dispatch(startLoadingPermissions());
				const permissions = await requestNotificationPermissions();
				dispatch(receiveSystemPermissions(permissions, !permissions.alert));
			} catch (err) {
				console.log('err', err);
			}
		};

		const checkPermission = () => {
			dispatch(startLoadingPermissions());
			checkPushNotificationPermissions((permissions) => {
				dispatch(receiveSystemPermissions(permissions, false));
			});
		};

		if (activeState === 'active') {
			if (userPrefersNotifications === 'explicitly-yes') {
				requestPermission();
			} else {
				checkPermission();
			}
		}
	}, [userPrefersNotifications, activeState, dispatch]);

	useEffect(() => {
		dispatch(loadNotificationSettings(userHash));
	}, [userHash, dispatch]);

	return null;
};
