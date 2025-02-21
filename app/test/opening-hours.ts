import test from 'ava';
import uzhMensa from '../../core/data/uzh-mensa';
import {Colors} from '../../core/functions/Colors';
import OpeningHours from '../../core/functions/opening-hours';

test('Main building', (t) => {
	const upperMensa = uzhMensa
		.find((m) => m.id === 'main-building')
		?.mensa.find((m) => m.slug === 'zentrum-mensa');
	t.false(
		new OpeningHours(
			upperMensa?.openingHours as string,
			'de',
			new Date('09/14/2017 10:00')
		).open
	);
	t.true(
		new OpeningHours(
			upperMensa?.openingHours as string,
			'de',
			new Date('09/14/2017 12:00')
		).open
	);
	t.deepEqual(
		new OpeningHours(
			upperMensa?.openingHours as string,
			'de',
			new Date('09/14/2017 10:00')
		).label(),
		['Geschlossen, öffnet 11:00', Colors.Red]
	);
	t.deepEqual(
		new OpeningHours(
			upperMensa?.openingHours as string,
			'de',
			new Date('09/10/2017 10:00')
		).label(),
		['Geschlossen, öffnet morgen um 11:00', Colors.Red]
	);
	t.deepEqual(
		new OpeningHours(
			upperMensa?.openingHours as string,
			'de',
			new Date('09/09/2017 10:00')
		).label(),
		['Geschlossen, öffnet 11.09. 11:00', Colors.Red]
	);
});

test('Cafeteria times', (t) => {
	const lowerMensa = uzhMensa
		.find((m) => m.id === 'main-building')
		?.mensa.find((m) => m.slug === 'zentrum-mercato');
	t.deepEqual(
		new OpeningHours(
			lowerMensa?.openingHours as string,
			'de',
			new Date('09/14/2017 10:00')
		).label(),
		['Geschlossen, öffnet 11:00', Colors.Red]
	);
	t.deepEqual(
		new OpeningHours(
			lowerMensa?.openingHours as string,
			'de',
			new Date('09/14/2017 11:00')
		).label(),
		['Offen', Colors.Green]
	);
	t.deepEqual(
		new OpeningHours(
			lowerMensa?.openingHours as string,
			'de',
			new Date('09/14/2017 13:15')
		).label(),
		['Offen, ab 14:30 nur Buffet', Colors.Orange]
	);
	t.deepEqual(
		new OpeningHours(
			lowerMensa?.openingHours as string,
			'de',
			new Date('09/14/2017 14:40')
		).label(),
		['Buffet offen, ab 17:00 Essensausgabe', Colors.Orange]
	);
	t.deepEqual(
		new OpeningHours(
			lowerMensa?.openingHours as string,
			'de',
			new Date('09/14/2017 16:00')
		).label(),
		['Buffet offen, ab 17:00 Essensausgabe', Colors.Orange]
	);
	t.deepEqual(
		new OpeningHours(
			lowerMensa?.openingHours as string,
			'de',
			new Date('09/14/2017 17:15')
		).label(),
		['Offen', Colors.Green]
	);
	t.deepEqual(
		new OpeningHours(
			lowerMensa?.openingHours as string,
			'de',
			new Date('09/14/2017 19:00')
		).label(),
		['Offen, schliesst um 19:30', Colors.Orange]
	);
	t.deepEqual(
		new OpeningHours(
			lowerMensa?.openingHours as string,
			'de',
			new Date('09/14/2017 20:00')
		).label(),
		['Geschlossen, öffnet morgen um 11:00', Colors.Red]
	);
});
