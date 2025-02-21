import differenceInHours from 'date-fns/differenceInHours';
import isValid from 'date-fns/isValid';
import {Router} from 'express';
import createHttpError from 'http-errors';
import {WithId} from 'mongodb';
import {daysAndHoursLabel} from '../../../../app/common/api/days-and-hours-label';
import {
	NewExamReturnPayload,
	SocketChatMessageTypes,
} from '../../../../core/actions/chat-server';
import {DatabaseUser} from '../../../../core/actions/users';
import {expandExamReturn} from '../../../../core/functions/expand-exam-return';
import {getChatRoomIdentifier} from '../../../../core/functions/get-chat-room-identifier';
import {makeExamReturnMessage} from '../../../../core/functions/make-exam-return-message';
import isPeriodValid from '../../../../core/functions/validate-period';
import {ExamReturnPutRequest} from '../../../../core/types/file-sharing-document';
import {ExamReturnStatistic} from '../../../../core/types/types';
import {
	examReturnsCollection,
	moduleCollection,
	userCollection,
} from '../../db/collections';
import {asyncHandler} from '../../handlers';
import {broadcastTo} from '../../helpers/broadcast-to';
import {notifyExamGradeReporterViaPush} from '../../helpers/notify-exam-grade-reporter-via-push';
import {getIoServer} from '../chat';
import {bannedUsers} from '../chat/banned-users';
import {sendPushNotificationToChannel} from '../chat/send-push-notification-to-channel';

export const examReturnsRouter = Router();

examReturnsRouter.put(
	'/',
	asyncHandler<
		{
			body: ExamReturnPutRequest;
		},
		{
			statistic: WithId<ExamReturnStatistic>;
		}
	>(async (req) => {
		const {body} = req;
		if (!body.uni_identifier) {
			throw createHttpError(400, 'No uni identifier was given');
		}

		if (!body.university) {
			throw createHttpError(400, 'No university was given');
		}

		const examDate = new Date(body.exam_date);
		if (!isValid(examDate)) {
			throw createHttpError(400, 'Invalid exam date');
		}

		if (examDate.getTime() > Date.now()) {
			throw createHttpError(400, 'Exam date is in the future');
		}

		const returnDate = new Date(body.return_date);
		if (!isValid(returnDate)) {
			throw createHttpError(400, 'Invalid return date');
		}

		if (returnDate.getTime() > Date.now()) {
			throw createHttpError(400, 'Exam return date');
		}

		if (returnDate.getTime() <= examDate.getTime()) {
			throw createHttpError(400, 'Return date is before exam date');
		}

		if (!isPeriodValid(body.university, body.period)) {
			throw createHttpError(400, 'Period invalid');
		}

		const {university, uni_identifier, period} = body;
		const mod = await moduleCollection().findOne({
			university,
			uni_identifier,
		});
		if (!mod) {
			throw createHttpError(404, 'Course not found');
		}

		const semesterWithPeriod = mod.semesters.find(
			(s) => s.period === body.period
		);
		const user = await userCollection().findOne({
			token: req.body.token,
		});
		if (!user) {
			throw createHttpError(401, 'Unauthenticated');
		}

		if (bannedUsers.includes(user.id)) {
			throw createHttpError(401, 'You are not allowed to do that');
		}

		if (!semesterWithPeriod) {
			throw createHttpError(400, 'Course does not exist in this semester');
		}

		const existing = await examReturnsCollection().findOne({
			university,
			uni_identifier,
			period,
		});
		if (existing) {
			throw createHttpError(400, 'Exam return already exists');
		}

		const reporter = await (async () => {
			if (user.admin && body.usernameOverride) {
				const newUser = await userCollection().findOne({
					username: new RegExp(['^', body.usernameOverride, '$'].join(''), 'i'),
				});
				return newUser as DatabaseUser;
			}

			return user as DatabaseUser;
		})();
		const inserted = await examReturnsCollection().insertOne({
			chatLanguage: user.preferredLanguage,
			differenceInHours: differenceInHours(returnDate, examDate),
			exam_date: examDate.getTime(),
			period,
			uni_identifier,
			university,
			reporter: reporter.id,
			reporterNotifiedViaPush: false,
			return_date: returnDate.getTime(),
		});

		const examReturn = inserted.ops[0];

		const expanded = await expandExamReturn(examReturn);
		const message = makeExamReturnMessage(expanded);
		const chatRoomIdentifier = getChatRoomIdentifier(
			uni_identifier,
			university
		);

		broadcastTo(
			getIoServer(),
			chatRoomIdentifier,
			SocketChatMessageTypes.NEW_EXAM_RETURN,
			{
				examReturnMessage: message,
			} as NewExamReturnPayload
		);

		const statistic = inserted.ops[0];
		if (body.skipNotification) {
			await notifyExamGradeReporterViaPush({
				reporter,
				statistic,
				uni_identifier,
				university,
			});
		} else {
			sendPushNotificationToChannel({
				uni_identifier,
				university,
				short_name: mod.short_name as string,
				title: (l) =>
					l === 'de'
						? `💯 Noten draussen - ${mod.short_name}`
						: `💯 Grades are out - ${mod.short_name}`,
				text: (l) =>
					l === 'de'
						? [
								`Rückgabezeit: ${daysAndHoursLabel(
									examDate.getTime(),
									returnDate.getTime(),
									'de'
								)}`,
								`Gemeldet von: ${user.username}`,
								'Angaben ohne Gewähr',
						  ].join('\n')
						: [
								`Return time: ${daysAndHoursLabel(
									examDate.getTime(),
									returnDate.getTime(),
									'en'
								)}`,
								`Reported by: ${user.username}`,
								'Data without guarantee',
						  ].join('\n'),
			});
		}

		return {
			statistic,
		};
	})
);
