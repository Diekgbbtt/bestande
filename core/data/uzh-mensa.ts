import {Institution} from '../models/credit';
import {coffee, dinner, FoodTag, mensa, snack} from '../models/food-tags';
import {UZH} from '../models/university';

export type MensaId =
	| 'main-building'
	| 'irchel'
	| 'center'
	| 'binzmuehle'
	| 'botgarten'
	| 'tierspital'
	| 'zzm'
	| 'eth-main-building'
	| 'hoenggerberg'
	| 'platte-14'
	| 'plattenstrasse'
	| 'zentrum-both';

export type MensaDay =
	| 'montag'
	| 'dienstag'
	| 'mittwoch'
	| 'donnerstag'
	| 'freitag';

type MensaDayTime = 'dinner';

export type SingleCanteen = {
	name: string;
	slug: string;
	tags: FoodTag[];
	rssId?: number;
	id?: number;
	openingHours: string;
	daytime?: MensaDayTime;
};

export type Mensa = {
	name: string;
	id: MensaId;
	institution: Institution | null;
	mensa: SingleCanteen[];
};

const mensi: Mensa[] = [
	{
		name: 'Zentrum',
		id: 'main-building',
		institution: UZH,
		mensa: [
			{
				name: 'Obere Mensa',
				slug: 'zentrum-mensa',
				tags: [mensa],
				rssId: 148,
				openingHours: 'Mo-Fr 11:00-14:30 open',
			},
			{
				name: 'Untere Mensa',
				slug: 'zentrum-mercato',
				tags: [mensa],
				rssId: 147,
				openingHours:
					'Mo-Fr 11:00-14:30 open, Mo-Fr 14:30-17:00 open "Buffet", Mo-Fr 17:00-19:30 open',
			},
			{
				name: 'Lichthof-Rondell',
				slug: 'lichthof-rondell',
				tags: [snack, coffee],
				rssId: 150,
				openingHours:
					'Mo-Fr 07:30-16:00 open "Cafeteria", Mo-Fr 11:00-14:00 open',
			},
			{
				name: 'Untere Mensa (Abendessen)',
				slug: 'zentrum-mercato-abend',
				tags: [mensa, dinner],
				rssId: 149,
				openingHours:
					'Mo-Fr 11:00-14:30 open, Mo-Fr 14:30-17:00 open "Buffet", Mo-Fr 17:00-19:30 open',
			},
			{
				rssId: 143,
				name: 'Platte 14',
				tags: [coffee, snack],
				slug: 'platte-14',
				openingHours: 'Mo-Fr 07:00-16:30',
			},
			{
				rssId: 143,
				name: 'Cafeteria',
				tags: [coffee, snack],
				slug: 'cafeteria-uzh-plattenstrasse',
				openingHours: 'Mo-Fr 07:00-16:30',
			},
			{
				name: 'Rämi 59',
				slug: 'raemi59',
				tags: [mensa],
				rssId: 346,
				openingHours:
					'Mo-Fr 07:30-15:00 open "Cafeteria", Mo-Fr 11:00-14:00 open; Sept 18 - Dec 23, Feb 1 - Jul 31, Mo-Fr open 07:30-16:00;',
			},
			{
				name: 'Zentrum für Zahnmedizin Cafeteria',
				slug: 'cafeteria-zzm',
				tags: [coffee, snack],
				rssId: 151,
				openingHours: 'Mo-Fr 07:00-17:00',
			},
			{
				rssId: 144,
				name: 'Botanischer Garten Cafeteria',
				tags: [coffee, snack],
				slug: 'cafeteria-uzh-botgarten',
				openingHours: 'Mo-Fr 09:00-17:00, Sa-Su 10:30-17:00',
			},
		],
	},
	{
		name: 'Platte 14',
		id: 'plattenstrasse',
		institution: UZH,
		mensa: [
			{
				rssId: 143,
				name: 'Platte 14',
				tags: [coffee, snack],
				slug: 'platte-14',
				openingHours: 'Mo-Fr 07:00-16:30',
			},
		],
	},
	{
		name: 'Irchel',
		id: 'irchel',
		institution: UZH,
		mensa: [
			{
				name: 'Mensa',
				rssId: 142,
				tags: [mensa],
				slug: 'mensa-uzh-irchel',
				openingHours: 'Mo-Fr 11:00-14:00',
			},
			{
				name: 'Atrium',
				rssId: 176,
				tags: [coffee, snack],
				slug: 'irchel-cafeteria-atrium',
				openingHours: 'Mo-Fr 08:45-16:00',
			},
			{
				name: 'Seerose',
				rssId: 241,
				tags: [coffee, snack],
				slug: 'irchel-cafeteria-seerose-mittag',
				openingHours: 'Mo-Fr 07:30-19:00',
			},
			{
				name: 'Seerose (Abendessen)',
				rssId: 256,
				tags: [snack, dinner],
				slug: 'irchel-cafeteria-seerose-abend',
				openingHours: 'Mo-Fr 07:30-19:00',
			},
			{
				rssId: 146,
				name: 'Tierspital',
				tags: [coffee, snack],
				slug: 'cafeteria-uzh-tierspital',
				openingHours: 'Mo-Fr 07:00-16:30',
			},
		],
	},
	{
		name: 'Rämi 59',
		id: 'center',
		institution: UZH,
		mensa: [
			{
				name: 'Rämi 59',
				slug: 'raemi59',
				tags: [mensa],
				rssId: 346,
				openingHours:
					'Mo-Fr 07:30-15:00 open "Cafeteria", Mo-Fr 11:00-14:00 open; Sept 18 - Dec 23, Feb 1 - Jul 31, Mo-Fr open 07:30-16:00;',
			},
		],
	},
	{
		name: 'Oerlikon',
		id: 'binzmuehle',
		institution: UZH,
		mensa: [
			{
				name: 'Mensa Binzmühle',
				rssId: 184,
				tags: [mensa],
				slug: 'mensa-uzh-binzmuehle',
				openingHours:
					'Mo-Do 07:45-14:30 open "Cafeteria", Mo-Do 11:15-14:00 open; Fr 06:45-16:30 open "Cafeteria", Fr 11:15-14:00 open',
			},
		],
	},
	{
		name: 'ZZM',
		id: 'zzm',
		institution: UZH,
		mensa: [
			{
				name: 'Cafeteria',
				slug: 'cafeteria-zzm',
				tags: [coffee, snack],
				rssId: 151,
				openingHours: 'Mo-Fr 07:00-17:00',
			},
		],
	},
	{
		name: 'Tierspital',
		id: 'tierspital',
		institution: UZH,
		mensa: [
			{
				rssId: 146,
				name: 'Cafeteria',
				tags: [coffee, snack],
				slug: 'cafeteria-uzh-tierspital',
				openingHours: 'Mo-Fr 07:00-16:30',
			},
		],
	},
	{
		name: 'Botanischer Garten',
		id: 'botgarten',
		institution: UZH,
		mensa: [
			{
				rssId: 144,
				name: 'Cafeteria',
				tags: [coffee, snack],
				slug: 'cafeteria-uzh-botgarten',
				openingHours: 'Mo-Fr 09:00-17:00, Sa-Su 10:30-17:00',
			},
		],
	},
];

export default mensi;
