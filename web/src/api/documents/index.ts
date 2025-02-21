import {Router} from 'express';
import createHttpError from 'http-errors';
import isNumber from 'lodash/isNumber';
import {ObjectID} from 'mongodb';
import {
	ExpandedPublicFileSharingDocument,
	FileSharingDeleteRequest,
	FileSharingDocument,
	FileSharingUploadRequest,
} from '../../../../core/types/file-sharing-document';
import {
	documentsCollection,
	moduleCollection,
	studentsCollection,
} from '../../db/collections';
import {asyncHandler} from '../../handlers';
import {bustGooglebot} from '../../helpers/bust-googlebot';
import {getHashedEmailFromRequest} from '../../firebase-backend';
import aws from 'aws-sdk';

export const documentsRouter = Router();

// const slackbot = process.env.SLACK_TOKEN
// 	? new Slackbot('hackercompany', process.env.SLACK_TOKEN)
// 	: null;

documentsRouter.put(
	'/',
	asyncHandler<
		{
			body: FileSharingUploadRequest;
		},
		{
			document: ExpandedPublicFileSharingDocument;
		}
	>(async (request) => {
		const {
			uni_identifier,
			university,
			fileSize,
			mimeType,
			s3Key,
			fileName,
			sendToChat,
		} = request.body;
		bustGooglebot(request.get('x-forwarded-for') as string);

		const email = await getHashedEmailFromRequest(request);
		if (!email) throw createHttpError(401, 'Invalid token');

		const user = await studentsCollection().findOne({
			email: email,
		});

		if (!user) {
			throw createHttpError(401, 'You need to login first');
		}

		const mod = await moduleCollection().findOne({
			university,
			uni_identifier,
		});
		if (!mod) {
			throw createHttpError(400, 'Course does not exist');
		}

		if (!isNumber(fileSize)) {
			throw createHttpError(400, 'File size is not numeric');
		}

		if (fileSize === 0) {
			throw createHttpError(400, 'File size is zero bytes');
		}

		if (fileSize < 0) {
			throw createHttpError(400, 'File size is below zero');
		}

		if (!s3Key) {
			throw createHttpError(400, 'Invalid S3 bucket file key');
		}

		if (!mimeType.includes('/')) {
			throw createHttpError(400, 'Invalid mime type');
		}

		const document: FileSharingDocument = {
			userId: user._id,
			uni_identifier,
			university,
			fileSize,
			mimeType,
			s3Key,
			fileName,
			uploaded: Date.now(),
			stats: {
				views: 0,
				downloads: 0,
			},
		};
		console.log('document', document);
		const result = await documentsCollection().insertOne(document);
		const {userId, ...documentFields} = result.ops[0];

		// if (sendToChat) {
		// 	postChatMessage({
		// 		message: giftedToMessage(
		// 			{
		// 				text: FILE_UPGRADE_TOKEN,
		// 				_id: uuid(),
		// 				createdAt: Date.now(),
		// 				user: {_id: user.id, verified: Boolean(user.verified)},
		// 			},
		// 			user.id,
		// 			university,
		// 			uni_identifier,
		// 			undefined,
		// 			[
		// 				{
		// 					type: 'FILE_ATTACHMENT',
		// 					fileId: documentFields._id.toHexString(),
		// 					key: uuid(),
		// 					fileName,
		// 				},
		// 			]
		// 		),
		// 		token,
		// 	});
		// }

		// if (slackbot) {
		// 	slackbot.send(
		// 		'#bestande-reviews',
		// 		[
		// 			'New document uploaded',
		// 			`filename: ${fileName}`,
		// 			`URL: https://bestande.s3.eu-central-1.amazonaws.com/${s3Key}`,
		// 			`Size: ${prettyBytes(fileSize)}`,
		// 		].join('\n')
		// 	);
		// }

		return {
			document: {
				...documentFields,
				_id: documentFields._id.toHexString(),
				user: {
					admin: false,
					avatar: null,
					id: userId,
					joined: 0,
					lastUsernameChange: 0,
					username: user.username,
					verified: false,
				},
			},
		};
	})
);

documentsRouter.get(
	'/:id',
	asyncHandler<{params: {id: string}}, ExpandedPublicFileSharingDocument>(
		async (request) => {
			const document = await documentsCollection().findOne({
				_id: new ObjectID(request.params.id),
			});
			if (!document) {
				throw createHttpError(404, 'Document not found');
			}

			const user = await studentsCollection().findOne({
				id: document?.userId,
			});
			if (!user) {
				throw createHttpError(400, 'Document not found');
			}

			const {userId, ...documentFields} = document;
			return {
				...documentFields,
				_id: documentFields._id.toHexString(),
				user: {
					username: user.username,
					admin: false,
					avatar: null,
					id: userId,
					joined: 0,
					lastUsernameChange: 0,
					verified: false,
				},
			};
		}
	)
);

documentsRouter.get(
	'/mine',
	asyncHandler<{}, FileSharingDocument[]>(async (request) => {
		const hashedEmail = await getHashedEmailFromRequest(request);
		if (!hashedEmail) throw createHttpError(401, 'Invalid token');

		const user = await studentsCollection().findOne({
			email: hashedEmail,
		});

		if (!user) {
			throw createHttpError(401, 'You need to login first');
		}

		const documents = await documentsCollection()
			.find({
				userId: user._id,
			})
			.toArray();

		return documents;
	})
);

documentsRouter.delete(
	'/:id',
	asyncHandler<{body: FileSharingDeleteRequest; params: {id: string}}, {}>(
		async (request) => {
			const hashedEmail = await getHashedEmailFromRequest(request);
			if (!hashedEmail) throw createHttpError(401, 'Invalid token');

			const user = await studentsCollection().findOne({
				email: hashedEmail,
			});
			if (!user) {
				throw createHttpError(401, 'Unauthenticated');
			}

			const document = await documentsCollection().findOne({
				_id: new ObjectID(request.params.id),
			});
			if (!document) {
				throw createHttpError(404, 'Document not found');
			}

			if (document.userId !== user._id) {
				throw createHttpError(403, 'You did not upload this document');
			}

			const digitalOceanSpacesEndpoint = new aws.Endpoint(
				'fra1.digitaloceanspaces.com'
			);

			const s3Instance = new aws.S3({
				endpoint: digitalOceanSpacesEndpoint,
			});
			const params = {Bucket: 'bestande', Key: document.s3Key};
			try {
				await s3Instance.headObject(params).promise();
				s3Instance.deleteObject(params).promise();
				await documentsCollection().deleteOne({
					_id: new ObjectID(request.params.id),
				});
			} catch (error) {
				console.log(error);
				throw createHttpError(400, 'Deleting the file in S3 bucket failed');
			}

			return {};
		}
	)
);

