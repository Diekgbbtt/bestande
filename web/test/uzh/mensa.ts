import fs from 'fs';
import path from 'path';
import {parseMensaDay, parsePrice} from '../../src/tasks/uzh-mensa';
import {test} from '../helpers/_test-with-context';

test.beforeEach((t) => {
	t.context.parseDemo = (file) => {
		const data = fs.readFileSync(
			path.join(__dirname, `demos/${file}.xml`),
			'utf8'
		);
		return parseMensaDay(data, 'montag');
	};
});

test('Should return null if no data available', (t) => {
	const parsed = t.context.parseDemo('mensa-empty');
	t.deepEqual(parsed, {
		menus: [],
		resolvedDate: new Date('2018-06-09 00:00:00 UTC'),
	});
});

test('Parse pricing', (t) => {
	t.deepEqual(parsePrice('CHF 1.80 / 2.30'), {
		unit: null,
		student: '1.80',
		worker: '2.30',
		external: '2.30',
	});

	t.deepEqual(parsePrice('CHF 1.80 / 2.30 / 3.50'), {
		unit: null,
		student: '1.80',
		worker: '2.30',
		external: '3.50',
	});

	t.deepEqual(parsePrice('CHF klein 1.70 / gross 3.00'), {
		student: '\nklein 1.70\ngross 3.00',
		worker: '\nklein 1.70\ngross 3.00',
		external: '\nklein 1.70\ngross 3.00',
	});

	t.deepEqual(parsePrice('CHF 1.80 / 2.20 / 2.50 pro 100 g'), {
		unit: '100g',
		student: '1.80',
		worker: '2.20',
		external: '2.50',
	});
});

test('Should get menu if data available', (t) => {
	const parsed = t.context.parseDemo('mensa-zfv');
	t.deepEqual(parsed, {
		resolvedDate: new Date('2018-06-08 00:00:00 UTC'),
		menus: [
			{
				title: 'einfach gut',
				description: [
					'Fischragout mit Crevetten',
					'und Kokosnusssauce',
					'Stangensellerie und Pak choi Gemüse',
					'und Nudeln',
					'Blattsalat oder Apfelmus',
				],
				footnote: 'Fisch:',
				allergens: ['GLUTEN_WHEAT', 'CRUSTACEANS', 'FISH', 'SOYA', 'CELERY'],
				labels: [],
				nutrition: {
					CARBOHYDRATES: {
						unit: 'GRAM',
						value: 72.4,
					},
					ENERGY: {
						unit: 'KCAL',
						value: 580,
					},
					FAT: {
						unit: 'GRAM',
						value: 15.3,
					},
					PROTEIN: {
						unit: 'GRAM',
						value: 36.5,
					},
				},
				pricing: {
					student: '5.40',
					worker: '7.00',
					external: '10.50',
					unit: null,
				},
			},
			{
				title: 'natürlich vegi',
				description: ['Falafel Burger', 'Tzatziki', 'Couscous Salat'],
				footnote: 'und frischer Gurkensalat',
				allergens: ['GLUTEN_WHEAT', 'MILK_LACTOSE', 'SULPHUR_DIOXIDE'],
				labels: [],
				nutrition: {
					CARBOHYDRATES: {
						unit: 'GRAM',
						value: 54,
					},
					ENERGY: {
						unit: 'KCAL',
						value: 468,
					},
					FAT: {
						unit: 'GRAM',
						value: 21.5,
					},
					PROTEIN: {
						unit: 'GRAM',
						value: 25.2,
					},
				},
				pricing: {
					external: '10.50',
					student: '5.40',
					worker: '7.00',
					unit: null,
				},
				vegetarian: true,
			},
		],
	});
});
