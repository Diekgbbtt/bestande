import {Router} from 'express';
import createHttpError from 'http-errors';
import {CourseDocumentsResponse, FileSortOption} from '../../../../core/types/types';
import {documentsCollection, studentsCollection} from '../../db/collections';
import {asyncHandler} from '../../handlers';
import {ExpandedPublicFileSharingDocument} from '../../../../core/types/file-sharing-document';
import {getHashedEmailFromRequest} from '../../firebase-backend';

export const moduleDocumentsRouter = Router();

moduleDocumentsRouter.get(
	'/',
	asyncHandler<
		{query: {offset?: number; sort?: FileSortOption}},
		CourseDocumentsResponse
	>(async (request, response) => {
		const documentCursor = () =>
			documentsCollection().find({
				uni_identifier: response.locals.module.uni_identifier,
				university: response.locals.module.university,
			});
		if (
			request.query.sort !== 'newest' &&
			request.query.sort !== 'oldest' &&
			request.query.sort !== 'most_downloaded' &&
			request.query.sort !== 'biggest' &&
			request.query.sort !== 'smallest'
		) {
			throw createHttpError(
				400,
				'?sort parameter must be either `newest`, `oldest`, `most_downloaded`, `biggest` or `smallest`'
			);
		}

		const [documents, total] = await Promise.all([
			documentCursor()
				.sort(
					request.query.sort === 'newest'
						? {
								uploaded: -1,
						  }
						: request.query.sort === 'oldest'
						? {
								uploaded: 1,
						  }
						: request.query.sort === 'most_downloaded'
						? {
								'stats.downloads': -1,
						  }
						: request.query.sort === 'biggest'
						? {
								fileSize: -1,
						  }
						: {
								fileSize: 1,
						  }
				)
				.skip(Number(request.query.offset) || 0)
				.limit(15)
				.toArray(),
			documentCursor().count(),
		]);

		const users = await studentsCollection()
			.find({
				_id: {$in: documents.map((m) => m.userId)},
			})
			.toArray();

		const publicDocuments = documents.map((d) => {
			const {userId, ...fields} = d;
			return {
				...fields,
				_id: fields._id.toHexString(),
				// user: databaseUserToUser(
				// 	users.find((u) => {
				// 		return u.id === userId;
				// 	}) as DatabaseUser
				// ),
			};
		});

		return {documents: publicDocuments, total};
	})
);

moduleDocumentsRouter.get(
	'/mine',
	asyncHandler<{}, ExpandedPublicFileSharingDocument[]>(
		async (request, response) => {
			const hashedEmail = await getHashedEmailFromRequest(request);

			if (!hashedEmail) throw createHttpError(401, 'Invalid token');

			const user = await studentsCollection().findOne({
				email: hashedEmail,
			});

			console.log(user);

			if (!user) {
				throw createHttpError(401, 'You need to login first');
			}

			const documents = await documentsCollection()
				.find({
					userId: user._id,
					uni_identifier: response.locals.module.uni_identifier,
					university: response.locals.module.university,
				})
				.toArray();

			return documents.map((d) => {
				return {...d, _id: d._id.toHexString()};
			});
		}
	)
);

