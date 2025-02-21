import fs from 'fs';
import path from 'path';
import {parseMensaMenu} from '../../src/tasks/eth-mensa';
import {parseEthMensaStreetfood} from '../../src/tasks/eth-mensa-streetfood';
import {test} from '../helpers/_test-with-context';

test.beforeEach((t) => {
	t.context.parseDemo = (file) => {
		const data = JSON.parse(
			fs.readFileSync(path.join(__dirname, `demos/${file}.json`), 'utf8')
		);
		return parseMensaMenu(data);
	};

	t.context.parseStreetFood = () => {
		const data = fs.readFileSync(
			path.join(__dirname, 'demos/streetfood-en.html'),
			'utf8'
		);
		return parseEthMensaStreetfood(data);
	};
});

test('Parse German menus correctly', (t) => {
	const parsed = t.context.parseDemo('menu-de');
	t.deepEqual(parsed[0], {
		title: 'Street',
		description: [
			'Fitnessteller Tandoori',
			'Pouletbrust Tandoori',
			'mit  Minze-Raita, Mais, Kokosranden,',
			'Tomaten, Linsen und Rotibrot',
		],
		swiss_meat: true,
		pricing: {student: '11.50', worker: '13.50', external: '16.00'},
		allergens: [
			'EGGS',
			'FISH',
			'GLUTEN_WHEAT',
			'MILK_LACTOSE',
			'NUTS',
			'SULPHUR_DIOXIDE',
			'CELERY',
			'MUSTARD',
			'SESAME',
			'SOYA',
		],
		origins: ['Schweiz'],
	});
});

test('Parse English menus correctly', (t) => {
	const parsed = t.context.parseDemo('menu-en');
	t.deepEqual(parsed[0], {
		title: 'Street',
		description: [
			'Vitality plate Tandoori',
			'Chicken breast Tandoori',
			'with mint raita, sweet corn, beetroot with coconut, ',
			'tomatoes, lentils and roti bread',
		],
		swiss_meat: true,
		pricing: {student: '11.50', worker: '13.50', external: '16.00'},
		allergens: [
			'EGGS',
			'FISH',
			'GLUTEN_WHEAT',
			'MILK_LACTOSE',
			'NUTS',
			'SULPHUR_DIOXIDE',
			'CELERY',
			'MUSTARD',
			'SESAME',
			'SOYA',
		],
		origins: ['Switzerland'],
	});
});

test('Parse ETH streetfood correctly', (t) => {
	const [menu] = t.context.parseStreetFood();
	t.is(menu[0].provider, 'Miró Coffee');
	t.is(menu[0].offer, 'Coffee / Pastry ');
});
