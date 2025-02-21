import dateformat from 'dateformat';
import got from 'got';
import moment from 'moment-timezone';
import ms from 'ms';
import striptags from 'striptags';
import titleize from 'titleize';
import {MensaDay} from '../../../core/data/uzh-mensa';
import {days} from '../../../core/functions/mensa-helpers';
import {truthy} from '../../../core/functions/truthy';
import {Allergen} from '../../../core/models/allergens';
import {AppLanguage} from '../../../core/models/app-language';
import {Meal} from '../../../core/types/food';
import {MealFlags} from '../../../core/types/types';
import TimeCache from '../helpers/time-cache';
import {parseEthMensaStreetfood} from './eth-mensa-streetfood';

const mensaCache = new TimeCache({validity: ms('12h')});

const allergenMap = {
	1: 'GLUTEN_WHEAT',
	2: 'CRUSTACEANS',
	3: 'EGGS',
	4: 'FISH',
	5: 'PEANUTS',
	6: 'SOYA',
	7: 'MILK_LACTOSE',
	8: 'NUTS',
	9: 'CELERY',
	10: 'MUSTARD',
	11: 'SESAME',
	12: 'SULPHUR_DIOXIDE',
	13: 'LUPIN',
	14: 'MOLLUSCS',
};

const parseInfos = (meal: {
	allergens: {allergen_id: number}[];
	origins: {label: string; origin_id: number}[];
	label?: string;
	description?: string;
}) => {
	const flags: MealFlags = {
		allergens: meal.allergens
			.map((a) => allergenMap[a.allergen_id] as Allergen)
			.filter(truthy),
		origins: meal.origins.length > 0 ? meal.origins.map((o) => o.label) : [],
	};
	if (
		meal.origins.find((o) => {
			return o.origin_id === 39;
		})
	) {
		flags.swiss_meat = true;
	}

	if (meal.label === 'GARDEN') {
		flags.vegetarian = true;
	}

	const fullText = [meal.label, ...(meal.description as string)].join(' ');
	if (
		/vegetarian/i.exec(fullText) ||
		/vegetarisch/i.exec(fullText) ||
		/vegi/i.exec(fullText)
	) {
		flags.vegetarian = true;
	}

	if (/vegan/i.exec(fullText)) {
		flags.vegan = true;
	}

	return flags;
};

const correctPrice = (price: string) => {
	if (price === 'NaN') {
		return null;
	}

	return price;
};

export const parseMensaMenu = (json: any): Meal[] => {
	const {menu} = json;
	return menu.meals
		.map((m) => {
			return {
				title: titleize(m.label),
				description: m.description.map((_) => striptags(_)),
				pricing: {
					student: correctPrice(m.prices.student || m.prices.staff),
					worker: correctPrice(m.prices.staff),
					external: correctPrice(m.prices.extern),
				},
				...parseInfos(m),
			};
		})
		.filter(
			(m) =>
				!m.description.find((s) => s.includes('We look forward')) &&
				!m.description.find((s) => s.includes('Dieses Menu servieren')) &&
				!m.description.find((s) => s.includes('Wir sind wieder')) &&
				!m.description.find((s) => s.includes('We look forward')) &&
				!m.description.find((s) =>
					s.includes('Servieren wir Ihnen bald wieder')
				) &&
				!m.description.find((s) => s === '-') &&
				!m.description.find((s) => s === 'Ausverkauft') &&
				!m.description.find((s) => s === 'sold out') &&
				!m.description.find((s) => s === 'Geschlossen')
		);
};

export const fetchStreetFood = async (): Promise<any[][]> => {
	const url =
		'https://www.ethz.ch/en/campus/getting-to-know/cafes-restaurants-shops/gastronomie/street-food.html';
	if (mensaCache.has(url)) {
		return mensaCache.get(url);
	}

	try {
		const {body} = await got(url);
		const parsed = parseEthMensaStreetfood(body);
		mensaCache.put(url, parsed);
		return parsed;
	} catch (err) {
		console.log('Failed to get street food', err.message);
		return [[], []];
	}
};

export const fetchMensa = async ({
	id,
	language = 'de',
	day,
	daytime = 'lunch',
}: {
	id: number;
	language: AppLanguage;
	day: MensaDay;
	daytime?: 'dinner' | 'lunch';
}) => {
	// Shift 1 days forward so it shows monday on sunday and saturday
	const date = new Date(Date.now() + ms('2d'));
	const resolvedDate = moment
		.tz(date, 'Europe/Zurich')
		.isoWeekday(days.indexOf(day) + 1)
		.toDate();
	const url = `https://www.webservices.ethz.ch/gastro/v1/RVRI/Q1E1/mensas/${id}/${language}/menus/daily/${dateformat(
		resolvedDate,
		'yyyy-mm-dd'
	)}/${daytime}?language=${language}`;
	if (mensaCache.has(url + daytime + day)) {
		return {
			menus: mensaCache.get(url + daytime + day) as Meal[],
			resolvedDate,
		};
	}

	const {body} = await got(url);
	const parsed = parseMensaMenu(JSON.parse(body));
	mensaCache.put(url + daytime + day, parsed);
	return {
		menus: parsed,
		resolvedDate,
	};
};
