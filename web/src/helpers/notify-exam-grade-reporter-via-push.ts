import format from 'date-fns/format';
import {DatabaseUser} from '../../../core/actions/users';
import {getChatRoomIdentifier} from '../../../core/functions/get-chat-room-identifier';
import {Institution} from '../../../core/models/credit';
import {ExamReturnStatistic} from '../../../core/types/types';
import {moduleCollection} from '../db/collections';
import {sendAndroidPushNotification} from './send-android-push-notification';
//import {sendIosPushNotification} from './send-ios-push-notification';

export const notifyExamGradeReporterViaPush = async ({
	reporter,
	statistic,
	uni_identifier,
	university,
}: {
	reporter: DatabaseUser;
	statistic: ExamReturnStatistic;
	uni_identifier: string;
	university: Institution;
}) => {
	const course = await moduleCollection().findOne({
		uni_identifier,
		university,
	});

	if (!course) {
		throw new Error('Course not found');
	}

	const days = Math.round(statistic.differenceInHours / 24);

	let title = '';
	let description = '';
	if (statistic.chatLanguage === 'de') {
		title = `${course.short_name} - Prüfungsrückgabestatistik`;
		description = [
			'Danke dass du in den Chat geschrieben hast! Folgendes wurde in die Statistik eingetragen:',
			`✍️ Prüfung am ${format(
				statistic.exam_date,
				'dd.MM.yyyy'
			)}, Noten am ${format(statistic.return_date, 'dd.MM.yyyy')}`,
			`🕐 ${days} ${days === 1 ? 'Tag' : 'Tage'} bis zur Rückgabe`,
		].join('\n');
		console.log(title);
		console.log(description);
	}

	if (statistic.chatLanguage === 'en') {
		title = `${course.short_name} - Exam return time statistic`;
		description = [
			'Thanks for writing in the Chat! We added the following to the statistic:',
			`✍️ Exam on ${format(
				statistic.exam_date,
				'dd.MM.yyyy'
			)}, Grades on ${format(statistic.return_date, 'dd.MM.yyyy')}`,
			`🕐 ${days} ${days === 1 ? 'day' : 'days'} to return`,
		].join('\n');
		console.log(title);
		console.log(description);
	}

	if (reporter.devices.length === 0) {
		console.log(`📱 ${reporter.username} has no push notifications :(`);
	} else {
		console.log(`📱 Sending notification to ${reporter.username}`);
	}

	for (const device of reporter.devices) {
		// if (device.platform === 'ios') {
		// 	await sendIosPushNotification({
		// 		deviceToken: device.notificationToken,
		// 		channel: getChatRoomIdentifier(uni_identifier, university),
		// 		title,
		// 		subtitle: description,
		// 		uni_identifier,
		// 		university,
		// 	});
		// } else if (device.platform === 'android') {
		// 	try {
		// 		await sendAndroidPushNotification({
		// 			deviceToken: device.notificationToken,
		// 			uni_identifier,
		// 			university,
		// 			title,
		// 			subtitle: description,
		// 			short_name: getChatRoomIdentifier(uni_identifier, university),
		// 		});
		// 	} catch (err) {
		// 		console.log('Error sending android notification', err);
		// 	}
		// }
	}
};
