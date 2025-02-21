import {Router} from 'express';
import createHttpError from 'http-errors';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import {PlatformOSType} from 'react-native';
import {userCollection} from '../../db/collections';
import {asyncHandler} from '../../handlers';

const router = Router();

router.post(
	'/register',
	asyncHandler<
		{
			body: {
				token: string;
				notificationToken: string;
				platform: PlatformOSType;
			};
		},
		{}
	>(async (request) => {
		const {token, notificationToken, platform} = request.body;
		const user = await userCollection().findOne({token});
		if (!user) {
			return createHttpError(404, 'User not found');
		}

		await userCollection().updateOne(
			{
				token,
			},
			{
				$set: {
					devices: uniqBy(
						[
							...user.devices,
							{
								platform,
								notificationToken,
							},
						],
						(d) =>
							d.notificationToken === notificationToken &&
							d.platform === platform
					),
				},
			}
		);
		return {};
	})
);

router.post(
	'/subscribe',
	asyncHandler<{body: {channels: string[]; token: string}}, {}>(
		async (request) => {
			const {token, channels} = request.body;
			const user = await userCollection().findOne({token});
			if (!user) {
				return createHttpError(404, 'User not found');
			}

			for (const channel of channels) {
				if (typeof channel !== 'string') {
					return createHttpError(400, 'Channel must be string');
				}
			}

			const newPushSubscriptions = uniq([
				...user.pushSubscriptions,
				...channels,
			]);
			await userCollection().updateOne(
				{
					token,
				},
				{
					$set: {
						pushSubscriptions: newPushSubscriptions,
					},
				}
			);
			return {};
		}
	)
);

router.post(
	'/unsubscribe',
	asyncHandler<{body: {channels: string[]; token: string}}, {}>(
		async (request) => {
			const {token, channels} = request.body;
			const user = await userCollection().findOne({token});
			if (!user) {
				return createHttpError(404, 'User not found');
			}

			for (const channel of channels) {
				if (typeof channel !== 'string') {
					return createHttpError(400, 'Channel must be string');
				}
			}

			await userCollection().updateOne(
				{
					token,
				},
				{
					$set: {
						pushSubscriptions: user.pushSubscriptions.filter(
							(u) => !channels.includes(u)
						),
					},
				}
			);
			return {};
		}
	)
);

export default router;
