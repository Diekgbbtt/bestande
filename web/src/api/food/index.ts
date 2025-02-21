import startOfDay from 'date-fns/startOfDay';
import {Router} from 'express';
import createError from 'http-errors';
import flattenDeep from 'lodash/flattenDeep';
import sortBy from 'lodash/sortBy';
import zip from 'lodash/zip';
import {ObjectID} from 'mongodb';
import Slackbot from 'slackbot';
import slugify from 'slugify';
import ethMensa from '../../../../core/data/eth-mensa';
import uzhMensa, {
	Mensa,
	MensaDay,
	SingleCanteen,
} from '../../../../core/data/uzh-mensa';
import {truthy} from '../../../../core/functions/truthy';
import {AppLanguage} from '../../../../core/models/app-language';
import {coffee, FoodTag, streetfood} from '../../../../core/models/food-tags';
import {ETH, UZH} from '../../../../core/models/university';
import {
	ApiFoodResponseWrapped,
	DbMealPicture,
	FoodApiResponse,
	Meal,
	MensaApiResponse,
} from '../../../../core/types/food';
import {isValidMd5} from '../../core/helpers/is-valid-md5';
import {mealPictureCollection} from '../../db/collections';
import {asyncHandler} from '../../handlers';
import {fetchMensa, fetchStreetFood} from '../../tasks/eth-mensa';
import {getInfo, getMenus} from '../../tasks/eth-mensa-streetfood';
import {fetchMensaDay} from '../../tasks/uzh-mensa';
import {mustBeAdmin} from '../middleware';

const slackbot = process.env.SLACK_TOKEN
	? new Slackbot('hackercompany', process.env.SLACK_TOKEN)
	: null;

const router = Router();

router.get(
	'/',
	asyncHandler<{}, Mensa[]>(async (request, response) => {
		const {institution} = await response.locals;
		if (institution === UZH) {
			return uzhMensa;
		}

		if (institution === ETH) {
			return ethMensa;
		}

		throw createError(400, 'Mensa not supported');
	})
);

const enhancePlans = async (
	response: MensaApiResponse[],
	requestToken: string | undefined
) => {
	const mensaSlugs = response.map((r) => r.slug);
	const meals = response.map((r) =>
		r.plan.map((meal) => {
			if (meal.description && meal.description.length > 0) {
				return meal.description[0].trim().toLowerCase();
			}

			return null;
		})
	);
	const query = {
		meal: {$in: flattenDeep(meals).filter(truthy)},
		mensa: {$in: flattenDeep(mensaSlugs).filter(truthy)},
	};
	const pictures = await mealPictureCollection().find(query).toArray();
	return response.map((r) => ({
		...r,
		plan: r.plan.map((meal) => ({
			...meal,
			pictures: sortBy(
				pictures
					.filter((p) => {
						return (
							meal.description &&
							meal.description.length > 0 &&
							p.meal === meal.description[0].trim().toLowerCase() &&
							r.slug === p.mensa
						);
					})
					.map((p) => {
						const {token, ...rest} = p;
						const isMine = token === requestToken;
						// @ts-expect-error
						return {...rest, isMine, _id: p._id as string};
					}),
				(p) => 0 - new Date(p.captured).getTime()
			),
		})),
	}));
};

const days = ['montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag'];

const getUzhMensaPlan = async (
	request: MensaPlanRequest
): Promise<ApiFoodResponseWrapped> => {
	const area = uzhMensa.find((m) => {
		return m.id === request.params.area;
	});
	if (!area) {
		throw createError(400, 'Area not found');
	}

	const plans = await Promise.all(
		area.mensa.map((mensa) =>
			fetchMensaDay(mensa.rssId as number, request.params.day)
		)
	);
	const resolvedDate = plans.length > 0 ? plans[0].resolvedDate : null;
	return {
		resolvedDate: resolvedDate || new Date(),
		mensa: zip(
			area.mensa,
			plans.map((p) => p.menus)
		).map(([mensa, plan]) => {
			return {
				...(mensa as SingleCanteen),
				plan: plan as Meal[],
			};
		}),
	};
};

const getStreetFoodTags = (provider: string): FoodTag[] => {
	return [
		streetfood,
		[
			'Miró Coffee',
			'DrüRadKafi',
			'Il Macchinista',
			'Kaffee & Kamele',
			'Bar Caffetteria Otter',
		].includes(provider.trim())
			? coffee
			: null,
	].filter(truthy);
};

const getStreetFoodForArea = async (area: string, day: string) => {
	const dayMap = {
		montag: 'Monday',
		dienstag: 'Tuesday',
		mittwoch: 'Wednesday',
		donnerstag: 'Thursday',
		freitag: 'Friday',
	};
	const [center, hoengger] = await fetchStreetFood();
	if (area === 'eth-main-building') {
		return center.filter((m) => m.day === dayMap[day]);
	}

	if (area === 'hoenggerberg') {
		return hoengger.filter((m) => m.day === dayMap[day]);
	}

	return [];
};

type MensaPlanRequest = {
	params: {
		area: string;
		day: MensaDay;
		language?: AppLanguage;
	};
	query?: {language: AppLanguage};
};

const getEthStreetFoodPlan = async (
	request: MensaPlanRequest
): Promise<MensaApiResponse[]> => {
	const area = ethMensa.find((m) => {
		return m.id === request.params.area;
	});
	if (!area) {
		throw createError(400, 'Area not found');
	}

	const streetFood = await getStreetFoodForArea(area.id, request.params.day);
	return streetFood
		.filter((food) => {
			const match = food.location.match(
				/(until|after)\s([0-9]{1,2})\.([0-9]{1,2})\./
			);
			if (match) {
				const [, word, day, month] = match;
				const time = new Date(
					`${new Date().getFullYear()}-${month}-${day}`
				).getTime();
				return word === 'until' ? time >= Date.now() : time <= Date.now();
			}

			return true;
		})
		.map((c) => {
			return {
				...{
					name: `${c.provider}`,
					tags: getStreetFoodTags(c.provider),
					slug: slugify(c.provider).toLowerCase(),
					link: c.providerLink,
					openingHours: '',
					id: slugify(c.provider).toLowerCase(),
					location: c.location,
				},
				...getInfo(c.providerLink, area),
				plan: getMenus(c.providerLink) || [
					{
						title: c.offer,
						description: [c.offer],
					},
				],
			};
		});
};

const getLanguageFromQuerySetting = (lang?: string) => {
	if (lang === 'de') {
		return 'de';
	}

	if (lang === 'en') {
		return 'en';
	}

	return 'de';
};

const getEthMensaPlan = async (
	request: MensaPlanRequest
): Promise<ApiFoodResponseWrapped> => {
	const area = ethMensa.find((m) => {
		return m.id === request.params.area;
	});
	if (!area) {
		throw createError(400, 'Area not found');
	}

	const plans = await Promise.all(
		area.mensa.map((mensa: SingleCanteen) =>
			fetchMensa({
				id: mensa.id as number,
				daytime: mensa.daytime,
				day: request.params.day,
				language: getLanguageFromQuerySetting(request.query?.language),
			})
		)
	);

	const resolvedDate = plans.length > 0 ? plans[0].resolvedDate : null;
	const normalMensaItem = zip(
		area.mensa,
		plans.map((p) => p.menus)
	).map(([mensa, plan]) => {
		return {
			...(mensa as SingleCanteen),
			plan,
		};
	}) as FoodApiResponse;
	return {
		resolvedDate: resolvedDate?.getTime() as number,
		mensa: normalMensaItem,
	};
};

router.post(
	'/pictures',
	asyncHandler<
		{
			body: {
				mensa?: string;
				meal?: string;
				token?: string;
				user?: string;
				source?: string;
			};
			headers: any;
		},
		{picture: DbMealPicture}
	>(async (request) => {
		const {body} = request;
		if (typeof body.mensa !== 'string') {
			throw createError(400, 'Mensa must be provided');
		}

		if (typeof body.meal !== 'string') {
			throw createError(400, 'Meal must be provided');
		}

		if (typeof body.token !== 'string' || !isValidMd5(body.token)) {
			throw createError(400, 'Token must be a md5 string');
		}

		if (body.user && typeof body.user !== 'string') {
			throw createError(400, 'User must be falsy or string');
		}

		if (typeof body.source !== 'string') {
			throw createError(400, 'Source must be a string');
		}

		const picture: DbMealPicture = {
			meal: body.meal.trim().toLowerCase(),
			token: body.token,
			user: body.user as string,
			source: body.source,
			mensa: body.mensa,
			captured: new Date(),
		};
		const ip = request.get('x-forwarded-for');
		// Bust Googlebot
		if (ip?.startsWith('108.177') || ip?.startsWith('66.102')) {
			throw createError(400, 'You are not allowed to upload pictures');
		}

		const insertion = await mealPictureCollection().insertOne(picture);
		slackbot.send(
			'#bestande-foodpics',
			[
				'New food pic:',
				`https://bestande.imgix.net/${body.source}?w=200`,
				`Mensa: ${body.mensa}`,
				`Delete link: http://bestande.ch/api/institution/uzh/food/pictures/${insertion.ops[0]._id.toHexString()}/delete?token=${
					body.token
				}`,
				`Request Headers: ${JSON.stringify(request.headers)}`,
			].join('\n')
		);
		return {
			picture: {
				...picture,
				isMine: true,
			},
		};
	})
);

const deleteHandler = async (request) => {
	if (!request.params.id || !ObjectID.isValid(request.params.id)) {
		throw createError(400, 'No valid ID provided');
	}

	const _id = new ObjectID(request.params.id);
	// eslint-disable-next-line @typescript-eslint/await-thenable
	const picture = await mealPictureCollection().findOne({
		_id,
	});
	if (!picture) {
		throw createError(404, 'Picture does not exist');
	}

	let token = null;
	if (request.get('x-bestande-token')) {
		token = request.get('x-bestande-token');
	} else if (request.query.token) {
		token = request.query.token;
	} else {
		throw createError(401, 'X-Bestande-Token not provided');
	}

	if (token !== picture.token) {
		throw createError(403, 'Token does not match');
	}

	await mealPictureCollection().deleteOne({
		_id,
	});
	return {};
};

router.post(
	'/pictures/:id/delete',
	asyncHandler<
		{
			params: {
				id: string;
			};
		},
		{}
	>(deleteHandler)
);
// @ts-expect-error
router.get('/pictures/:id/delete', mustBeAdmin, asyncHandler(deleteHandler));

router.get(
	'/:area/:day',

	asyncHandler<MensaPlanRequest, ApiFoodResponseWrapped>(
		async (request, response) => {
			if (!days.includes(request.params.day)) {
				throw createError(400, 'Tag nicht verfügbar');
			}

			const {institution} = response.locals;
			if (request.params.area === 'zentrum-both') {
				const mensaPlanUzh = await getUzhMensaPlan({
					...request,
					params: {
						...request.params,
						area: 'main-building',
					},
				});
				const mensaPlanEth = await getEthMensaPlan({
					...request,
					params: {
						...request.params,
						area: 'eth-main-building',
					},
				});
				// Street food deactivated
				/*
				const streetFood = await getEthStreetFoodPlan({
					...request,
					params: {
						...request.params,
						area: 'eth-main-building',
					},
				});
				*/
				const streetFood = [];
				const uzhDate = startOfDay(
					new Date(mensaPlanUzh.resolvedDate)
				).getTime();
				const ethDate = startOfDay(
					new Date(mensaPlanEth.resolvedDate)
				).getTime();
				if (uzhDate !== ethDate) {
					if (uzhDate > ethDate) {
						return {
							resolvedDate: mensaPlanUzh.resolvedDate,
							mensa: await enhancePlans(
								[...mensaPlanUzh.mensa, ...streetFood],
								request.get('x-bestande-token')
							),
						};
					}

					return {
						resolvedDate: mensaPlanEth.resolvedDate,
						mensa: await enhancePlans(
							[...mensaPlanEth.mensa, ...streetFood],
							request.get('x-bestande-token')
						),
					};
				}

				return {
					resolvedDate: mensaPlanUzh.resolvedDate,
					mensa:
						institution === UZH
							? await enhancePlans(
								[...mensaPlanUzh.mensa, ...mensaPlanEth.mensa, ...streetFood],
								request.get('x-bestande-token')
							  )
							: await enhancePlans(
								[...mensaPlanEth.mensa, ...mensaPlanUzh.mensa, ...streetFood],
								request.get('x-bestande-token')
							  ),
				};
			}

			if (institution === UZH) {
				const mensaPlan = await getUzhMensaPlan(request);
				return {
					...mensaPlan,
					mensa: await enhancePlans(
						mensaPlan.mensa,
						request.get('x-bestande-token')
					),
				};
			}

			if (institution === ETH) {
				const mensaPlan = await getEthMensaPlan(request);
				const streetFood = await getEthStreetFoodPlan(request);
				return {
					resolvedDate: mensaPlan.resolvedDate,
					mensa: await enhancePlans(
						[...mensaPlan.mensa, ...streetFood],
						request.get('x-bestande-token')
					),
				};
			}

			throw createError(400, 'Mensa not supported');
		}
	)
);

export default router;
