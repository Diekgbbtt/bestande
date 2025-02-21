import xns from 'xns';
import {DatabaseUser} from '../core/actions/users';
import {userCollection} from '../web/src/db/collections';
import {connectToMongo} from '../web/src/db/modern';
import {sendAndroidPushNotification} from '../web/src/helpers/send-android-push-notification';
// import {sendIosPushNotification} from '../web/src/helpers/send-ios-push-notification';

xns(async () => {
	await connectToMongo();

	let cursor = userCollection().find({
		'devices.0': {$exists: true},
		sentSpring21BooksUpdate: {$exists: false},
	});
	cursor = cursor.addCursorFlag('noCursorTimeout', true);
	const count = await cursor.count();
	console.log(`Affects ${count} people`);

	let i = 0;

	while (await cursor.hasNext()) {
		const user = (await cursor.next()) as DatabaseUser;

		let title = '📚 Verkaufe deine Bücher';
		if (user.preferredLanguage === 'en') {
			title = '📚 Sell your books';
		}

		let subtitle =
			'Hast du Bücher die du nicht mehr brauchst? Finde einen Käufer, bevor das FS21 anfängt.';
		if (user.preferredLanguage === 'en') {
			subtitle =
				"Do you have books you don't need anymore? Find a buyer before the spring semester starts.";
		}

		i++;
		for (const device of user.devices) {
			// if (device.platform === 'ios') {
			// 	await sendIosPushNotification({
			// 		deviceToken: device.notificationToken,
			// 		channel: 'all',
			// 		title,
			// 		subtitle,
			// 		uni_identifier: '',
			// 		university: '',
			// 	});
			// } else if (device.platform === 'android') {
			// 	try {
			// 		await sendAndroidPushNotification({
			// 			deviceToken: device.notificationToken,
			// 			uni_identifier: '',
			// 			university: '',
			// 			title,
			// 			subtitle,
			// 			short_name: 'all',
			// 		});
			// 	} catch (err) {
			// 		console.log('Error sending android notification', err);
			// 	}
			// }
		}

		await userCollection().updateOne(
			{
				id: user.id,
			},
			{
				$set: {
					sentSpring21BooksUpdate: Date.now(),
				},
			}
		);
		console.log(`[${i}] ${user.username}`);
	}
});
