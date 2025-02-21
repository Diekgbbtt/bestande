import React from 'react';
import {useDispatch} from 'react-redux';
import {CellWithSwitch} from '../../../core/components/CellWithSwitch';
import {CreditHelpers} from '../../../core/functions/CreditHelpers';
import {getChatRoomIdentifier} from '../../../core/functions/get-chat-room-identifier';
import {getModuleId} from '../../../core/functions/get-module-id';
import {getUserHash} from '../../../core/functions/get-user-hash';
import {useAppState} from '../../../core/functions/use-app-state';
import {useLanguage} from '../../../core/functions/use-language';
import {Credit} from '../../../core/models/credit';
import rawStrings from '../../../core/raw-strings';
import {
	subscribeToChannelsAction,
	unsubscribeFromChannelsAction,
} from '../../../core/reducers/notifications';
import {isDeviceRegistered} from '../api/is-device-registered';

export const CreditNotificationSettings = ({
	credit,
	inCreditConfiguration,
}: {
	credit: Credit;
	inCreditConfiguration: boolean;
}) => {
	const chatRoomId = getChatRoomIdentifier(
		getModuleId(credit) as string,
		CreditHelpers.getInstitution(credit)
	);
	const token = useAppState((state) => getUserHash(state, null));
	const dispatch = useDispatch();
	const notificationSettingsState = useAppState((state) => state.notifications);
	const hasSystemPermission = useAppState(
		(state) => state.notifications.permissions?.alert
	);
	const deviceRegistered = useAppState((state) => isDeviceRegistered(state));
	const notificationsAreEnabled = hasSystemPermission && deviceRegistered;
	const language = useLanguage();
	const {
		notificationSettings,
		isSwitchingSubscriptionStateForRoom,
	} = notificationSettingsState;
	return (
		<CellWithSwitch
			text={
				inCreditConfiguration
					? rawStrings.NOTIFICATIONS_ENABLED[language]
					: credit.short_name
			}
			disabled={!notificationsAreEnabled}
			enabled={Boolean(
				notificationsAreEnabled &&
					(notificationSettings?.pushSubscriptions.indexOf(chatRoomId) ?? -1) >
						-1
			)}
			onChange={(val: boolean) => {
				if (val) {
					dispatch(subscribeToChannelsAction(token, [chatRoomId]));
				} else {
					dispatch(unsubscribeFromChannelsAction(token, [chatRoomId]));
				}
			}}
			loading={isSwitchingSubscriptionStateForRoom[chatRoomId]}
		/>
	);
};
