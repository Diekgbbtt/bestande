import createHttpError from 'http-errors';
import {
	getAccountUpdatesChannelName,
	NewNonceNotification,
	SocketChatMessageTypes,
} from '../../../../core/actions/chat-server';
import {
	SetCoursesResponse,
	UpdateCoursesRequest,
} from '../../../../core/types/course-sync';
import {moduleCollectionCollection, userCollection} from '../../db/collections';
import {asyncHandler} from '../../handlers';
import {getIoServer} from '../chat';

const processUpdate = async (body: UpdateCoursesRequest) => {
	if (body.payload.type === 'set-courses') {
		return Promise.all(
			body.payload.courses.map(async (c) => {
				await moduleCollectionCollection().updateOne(
					{
						uni_identifier: c.uni_identifier,
						university: c.university,
						user: body.token,
					},
					{
						$set: {
							period: c.period,
							type: 'authenticated',
							grade: c.grade,
						},
					},
					{
						upsert: true,
					}
				);
			})
		);
	}

	if (body.payload.type === 'remove-course') {
		return moduleCollectionCollection().deleteOne({
			uni_identifier: body.payload.removal.uni_identifier,
			university: body.payload.removal.university,
		});
	}

	throw createHttpError(400, 'bad removal type');
};

export const setCourses = asyncHandler<
	{body: UpdateCoursesRequest},
	SetCoursesResponse
>(async (req) => {
	const user = await userCollection().findOne({
		token: req.body.token,
	});
	if (!user) {
		throw createHttpError(401, 'Unauthenticated');
	}

	const oldNonce = user.moduleCollectionNonce ?? 0;
	if (typeof oldNonce !== 'number') {
		throw createHttpError(409, 'must pass nonce');
	}

	if (req.body.nonce < oldNonce) {
		throw createHttpError(409, 'Lower nonce than server');
	}

	await processUpdate(req.body);
	await userCollection().updateOne(
		{
			id: user.id,
		},
		{
			$set: {
				moduleCollectionNonce: req.body.nonce,
			},
		}
	);
	const ioServer = getIoServer();
	ioServer
		.to(getAccountUpdatesChannelName(req.body.token))
		.emit(SocketChatMessageTypes.NEW_NONCE, {
			newNonce: req.body.nonce,
		} as NewNonceNotification);
	return {
		newNonce: req.body.nonce,
	};
});
