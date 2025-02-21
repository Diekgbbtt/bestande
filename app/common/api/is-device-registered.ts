import {createSelector} from 'reselect';
import {AppState} from '../../../core/types/app-state';

export const isDeviceRegistered = createSelector(
	[
		(state: AppState) => state.notifications.notificationToken,
		(state: AppState) => state.notifications.notificationSettings,
	],
	(token, settings): boolean => {
		return Boolean(
			token &&
				settings &&
				settings.devices.find((d) => {
					return d.notificationToken === token;
				})
		);
	}
);
