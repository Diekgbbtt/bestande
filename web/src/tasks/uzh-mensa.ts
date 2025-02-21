import cheerio from 'cheerio';
import entDecode from 'ent/decode';
import got from 'got';
import pickBy from 'lodash/pickBy';
import ms from 'ms';
import {MensaDay} from '../../../core/data/uzh-mensa';
import {truthy} from '../../../core/functions/truthy';
import {Allergen} from '../../../core/models/allergens';
import {Meal, MealPricing} from '../../../core/types/food';
import {MealFlags} from '../../../core/types/types';
import TimeCache from '../helpers/time-cache';

// Price formats
// CHF klein 1.70 / gross 3.00
// CHF 1.80 / 2.30
// CHF 9.20 / 10.50 / 12.00
// CHF 1.80 / 2.20 / 2.50 pro 100 g

const mensaCache = new TimeCache({validity: ms('3h')});

const stripLeadingZeroes = (str: string) => {
	if (!str) {
		return str;
	}

	while (str.startsWith('0')) {
		str = str.substring(1);
	}

	return str;
};

export const parsePrice = (price: string): MealPricing | null => {
	const priceMatch = /CHF klein ([0-9.]+) \/ gross ([0-9.]+)/.exec(price);
	if (priceMatch) {
		const _price = `\nklein ${priceMatch[1]}\ngross ${priceMatch[2]}`;
		return {
			student: _price,
			worker: _price,
			external: _price,
		};
	}

	const priceMatch2 = /CHF ([0-9.]+) \/ ([0-9.]+)( \/ ([0-9.]+))?/.exec(price);
	if (priceMatch2) {
		return {
			student: stripLeadingZeroes(priceMatch2[1]),
			worker: stripLeadingZeroes(priceMatch2[2]),
			external:
				stripLeadingZeroes(priceMatch2[4]) ||
				stripLeadingZeroes(priceMatch2[2]),
			unit: /100(\s?)g/.exec(price) ? '100g' : null,
		};
	}

	return null;
};

const parseDescription = (
	description: string
): [string[], string | null | undefined] => {
	const replaceBr = cheerio
		.load(description)
		.html()
		.replace(/<br\s?\/?>/g, '\n');
	const splitted: string[] = (cheerio
		.load(replaceBr)
		// @ts-expect-error
		.text() as string)
		.trim()
		.split('\n')
		.map((a) => a.trim());
	let footnote: string | null | undefined = null;
	if (splitted.length > 2) {
		if (splitted[splitted.length - 2] === '') {
			footnote = splitted.pop();

			splitted.pop();
		}
	}

	return [splitted.filter(truthy), footnote];
};

const parsePacman = (url) => {
	if (url === 'http://zfv.ch/images/rss/pacman-green.png') {
		return 'green';
	}

	if (url === 'http://zfv.ch/images/rss/pacman-yellow.png') {
		return 'yellow';
	}

	if (url === 'http://zfv.ch/images/rss/pacman-red.png') {
		return 'red';
	}

	if (url === 'http://zfv.ch/static/menu-icons/zfv_icon_vegetarian_32px.png') {
		return 'vegetarian';
	}

	if (url === 'http://zfv.ch/static/menu-icons/zfv_icon_local_32px.png') {
		return 'swiss';
	}

	return null;
};

const parseInfos = (
	title: string,
	description: string,
	footnote: string,
	labels: string[]
) => {
	const flags: MealFlags = {};
	const setFlag = (
		text: string | null,
		flag: keyof MealFlags,
		value: any
	): void => {
		flags[flag] = value;
		if (text === footnote) {
			flags.removeFootnote = true;
		}
	};

	[title, description, footnote].forEach((text) => {
		if (!text) {
			return;
		}

		if (/vegetarisch/i.exec(text) || /vegi/i.exec(text)) {
			setFlag(text, 'vegetarian', true);
		}

		if (/vegan/i.exec(text)) {
			setFlag(text, 'vegan', true);
		}

		if (/gluten-free/i.exec(text) || /glutenfrei/i.exec(text)) {
			setFlag(text, 'gluten_free', true);
		}

		if (text.includes('Fleisch: Schweiz')) {
			setFlag(text, 'swiss_meat', true);
		}

		if (
			/Fleisch/i.exec(text) &&
			(text.includes('CH') || footnote?.includes('Schweiz'))
		) {
			setFlag(text, 'swiss_meat', true);
		}
	});
	if (labels.includes('vegetarian')) {
		setFlag(null, 'vegetarian', true);
	}

	return flags;
};

const parseAllergens = (allergens?: string): Allergen[] => {
	if (!allergens) {
		return [];
	}

	const withoutPrefix = allergens.replace('Allergikerinformationen:', '');
	return withoutPrefix
		.split(',')
		.map((s) => s.trim())
		.map((a) => {
			return {
				'Glutenhaltiges Getreide': 'GLUTEN_WHEAT',
				Krebstiere: 'CRUSTACEANS',
				Fisch: 'FISH',
				Soja: 'SOYA',
				Sellerie: 'CELERY',
				Milch: 'MILK_LACTOSE',
				'Schwefeldioxid und Sulfite': 'SULPHUR_DIOXIDE',
				Eier: 'EGGS',
				Erdnüsse: 'PEANUTS',
				'Hartschalenobst (Nüsse)': 'NUTS',
				Sesam: 'SESAME',
				Senf: 'MUSTARD',
				Weichtiere: 'MOLLUSCS',
				Lupine: 'LUPIN',
			}[a] as Allergen;
		})
		.filter(truthy);
};

const parseKcal = (value: string) => {
	const match = /([0-9]{1,4})\skcal/.exec(value.replace("'", '').replace("'", ''));
	if (!match) {
		return null;
	}

	return {
		unit: 'KCAL',
		value: parseInt(match[1], 10),
	};
};

const parseGramm = (value: string) => {
	const match = /([0-9]{1,3})\.([0-9]{1,3})\sg/.exec(value);
	if (!match) {
		return null;
	}

	return {
		unit: 'GRAM',
		value: parseInt(match[1], 10) + parseInt(match[2], 10) / 10,
	};
};

const parseNutritionalInfo = (html: string) => {
	if (!html) {
		return null;
	}

	const _$ = cheerio.load(`<table>${html.trim()}</table>`);
	const rows = _$('tr')
		.map((i, row) => {
			return _$(row)
				.find('td')
				.map((_i, cell) => {
					return entDecode(_$(cell).html()).trim();
				})
				.toArray();
		})
		.toArray();
	const maps = {};
	for (let i = 0; i < rows.length; i += 2) {
		const key = String(rows[i]) || 1;
		maps[
			{
				Eiweiss: 'PROTEIN',
				Energie: 'ENERGY',
				Fett: 'FAT',
				Kohlenhydrate: 'CARBOHYDRATES',
			}[key]
		] =
			key === 'Energie'
				? parseKcal(String(rows[i + 1]))
				: parseGramm(String(rows[i + 1]));
	}

	return pickBy(maps);
};

export const parseMensaDay = (
	html: string,
	day: MensaDay
): {
	resolvedDate: Date | null;
	menus: Meal[];
} => {
	const $ = cheerio.load(html);
	const dateMatch = /([0-9]{2})\.([0-9]{2})\.([0-9]{4})/.exec($('title').text());
	const resolvedDate = dateMatch
		? new Date(`${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`)
		: null;
	const content = $('summary');
	if (content.length === 0 || content.html()?.trim() === '') {
		return {resolvedDate: new Date(), menus: []};
	}

	const nodes = $(content).find('h3,p,img,table');
	let menus: any[] = [];
	nodes.each((i, n) => {
		if (n.tagName === 'h3') {
			menus.push({
				text: [],
				labels: [],
				allergens: null,
			});
		}

		if (n.tagName === 'img') {
			menus[menus.length - 1].labels.push(parsePacman(n.attribs.src));
		} else if (n.tagName === 'table') {
			menus[menus.length - 1].nutrition = $(n).html();
		} else {
			const _html = $(n).html();
			if (_html?.match(/Allergikerinformationen:/)) {
				menus[menus.length - 1].allergens = $(n).html();
			} else {
				menus[menus.length - 1].text.push($(n).html());
			}
		}
	});
	// Structure menus
	menus = menus.map(({text, labels, allergens, nutrition}) => {
		const [title, ...description] = text;
		return {
			title,
			description: description.join(''),
			labels: labels.filter(truthy),
			allergens: parseAllergens(allergens),
			nutrition: parseNutritionalInfo(nutrition),
		};
	});
	// Only menus, no opening times
	menus = menus.filter(
		(m) =>
			m.title.indexOf('CHF') > 0 ||
			m.title.indexOf('Foifer') > 0 ||
			m.title.indexOf('Snacks') > 0 ||
			m.title.indexOf('Extras') > 0
	);
	// Extract pricing into field
	menus = menus.map((m) => {
		const newFields: {
			pricing?: MealPricing;
		} = {};
		const _nodes = $(entDecode(m.title).trim());
		let title = '';
		let pricingString: string | undefined;
		_nodes.each((i, n) => {
			if (n.type === 'text') {
				// @ts-expect-error
				title += n.data;
			}

			if (n.type === 'tag' && n.name === 'span' && !newFields.pricing) {
				pricingString = $(n).text();
			}
		});

		if (pricingString) {
			const price = parsePrice(pricingString);
			if (price) {
				newFields.pricing = price;
			}
		}

		let [description, footnote] = parseDescription(m.description);
		const {removeFootnote, ...otherFields} = parseInfos(
			title,
			description.join('\n'),
			footnote as string,
			m.labels
		);
		if (removeFootnote) {
			footnote = null;
		}

		title = title.replace('Mittwochshit', 'Mittwochs-Hit');
		title = title.replace('Freitagshit', 'Freitags-Hit');
		return pickBy({
			...m,
			title: title.trim(),
			description,
			footnote,
			...newFields,
			...otherFields,
		});
	});
	menus = menus.filter((m) => {
		return !(m.title.match(/Mittwoch/) && day !== 'mittwoch');
	});
	menus = menus.filter((m) => {
		return !(m.title.match(/Freitag/) && day !== 'freitag');
	});
	return {menus, resolvedDate};
};

export const fetchMensaDay = async (
	rssId: number,
	day: MensaDay = 'montag'
): Promise<{
	resolvedDate: Date | null;
	menus: Meal[];
}> => {
	try {
		const url = `https://zfv.ch/de/menus/rssMenuPlan?menuId=${rssId}&type=uzh2&dayOfWeek=${
			['montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag'].indexOf(
				day
			) + 1
		}`;
		if (mensaCache.has(url)) {
			return mensaCache.get(url);
		}

		const {body} = await got(url);
		const parsed = parseMensaDay(body, day);
		mensaCache.put(url, parsed);
		return parsed;
	} catch (err) {
		if (err.statusCode === 404) {
			return {
				menus: [],
				resolvedDate: new Date(),
			};
		}

		throw err;
	}
};
