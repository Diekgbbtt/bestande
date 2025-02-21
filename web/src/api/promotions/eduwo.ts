import {Router} from 'express';
import got from 'got';
import {eduwoCollection} from '../../db/collections';
import {asyncHandler} from '../../handlers';

const router = Router();

router.post(
	'/',
	asyncHandler<
		{
			body: {
				review: any;
			};
		},
		{}
	>(async (request) => {
		let submittedToEduwo = false;
		const response = await got('https://api.eduwo.ch/v1/review', {
			json: true,
			method: 'post',
			body: {
				...request.body.review,
				school_id: 8,
				ref: 'bestande',
			},
		});
		if (response.statusCode === 201) {
			submittedToEduwo = true;
		}

		await eduwoCollection().insertOne({
			...request.body.review,
			submittedToEduwo,
		});
		return {};
	})
);

export default router;
