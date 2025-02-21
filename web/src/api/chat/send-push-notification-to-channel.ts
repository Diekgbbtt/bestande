import uniqBy from 'lodash/uniqBy';
import {DatabaseUser} from '../../../../core/actions/users';
import {getChatRoomIdentifier} from '../../../../core/functions/get-chat-room-identifier';
import {AppLanguage} from '../../../../core/models/app-language';
import {Institution} from '../../../../core/models/credit';
import {userCollection} from '../../db/collections';
import {sendAndroidPushNotification} from '../../helpers/send-android-push-notification';
//import {sendIosPushNotification} from '../../helpers/send-ios-push-notification';

export const sendPushNotificationToChannel = async ({
	uni_identifier,
	university,
	text,
	title,
	short_name,
}: {
	uni_identifier: string;
	university: Institution;
	text: (lang: AppLanguage) => string;
	title: (lang: AppLanguage) => string;
	short_name: string;
}) => {
	const chatRoomId = getChatRoomIdentifier(uni_identifier, university);
	const usersWithNotificationsEnabled = await userCollection()
		.find({
			pushSubscriptions: chatRoomId,
		})
		.toArray();
	const admins = (await userCollection()
		.find({
			pushSubscriptions: 'all',
		})
		.toArray()) as DatabaseUser[];
	const usersToDeliverTo = uniqBy(
		[...usersWithNotificationsEnabled, ...admins],
		(u) => u.id
	);
	for (const notificationUser of usersToDeliverTo) {
		for (const device of notificationUser.devices) {
			// if (device.platform === 'ios') {
			// 	sendIosPushNotification({
			// 		deviceToken: device.notificationToken,
			// 		channel: chatRoomId,
			// 		title: title(notificationUser.preferredLanguage),
			// 		subtitle: text(notificationUser.preferredLanguage),
			// 		uni_identifier,
			// 		university,
			// 	})
			// 		.then(() => {
			// 			console.log('message sent');
			// 		})
			// 		.catch(() => {
			// 			console.log('message not send');
			// 		});
			// } else if (device.platform === 'android') {
			// 	sendAndroidPushNotification({
			// 		deviceToken: device.notificationToken,
			// 		uni_identifier,
			// 		university,
			// 		title: title(notificationUser.preferredLanguage),
			// 		subtitle: text(notificationUser.preferredLanguage),
			// 		short_name,
			// 	}).catch(() => {
			// 		// TODO: Remove Push token
			// 	});
			// }
		}
	}
};
