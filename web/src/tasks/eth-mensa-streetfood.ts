import cheerio from 'cheerio';
import {truthy} from '../../../core/functions/truthy';
import {Meal} from '../../../core/types/food';

export const getInfo = (
	url: string,
	area: {
		id: string;
	}
) => {
	if (url === 'https://www.pizzamobil.ch/') {
		return {
			openingHours: '11:30-13:15 open',
		};
	}

	if (url === 'https://www.flammwerk.ch/') {
		return {
			openingHours: '11:00-14:30 open',
		};
	}

	if (
		url ===
		'https://www.facebook.com/Ada-Lokma-VEGAN-und-VEGETARISCH-861850303935745/info/?ref=page_internal'
	) {
		return {
			openingHours: '09:00-17:00 open',
		};
	}

	if (url === 'http://www.aess-bar.ch/') {
		return {
			openingHours: '9:00-15:00 open',
		};
	}

	if (url === 'http://www.rhystorante.ch/') {
		return {
			openingHours: '11:00-16:00 open',
		};
	}

	if (url === 'http://www.rollingfood.ch/') {
		return {
			openingHours: '11-14:30, 17-19:30 open',
		};
	}

	if (url === 'http://www.natura-gueggeli.ch/') {
		return {
			openingHours: '11:00-22:00 open',
		};
	}

	if (url === 'http://falafel-vegan.ch/') {
		return {
			openingHours: '10:00-14:00 open',
		};
	}

	if (url === 'https://www.kempers.swiss/') {
		return {
			openingHours: '11:00-14:00 open',
		};
	}

	if (url === 'http://ilmacchinista.ch/') {
		if (area.id === 'eth-main-building') {
			return {
				openingHours: '9:00-15:00 open',
			};
		}

		if (area.id === 'hoenggerberg') {
			return {
				openingHours: '8:00-16:00 open',
			};
		}
	}

	return {};
};

// eslint-disable-next-line complexity
export const getMenus = (url: string): Meal[] => {
	if (url === 'https://www.eltacondeoro.com/') {
		return [
			{
				title: 'Tacos al Pastor',
				description: ['Orden de 5 Tacos'],
				pricing: {
					student: '15.00',
					worker: '15.00',
					external: '15.00',
				},
				allergens: [],
			},
			{
				title: 'Tacos de Chorizo',
				description: ['Orden de 5 Tacos'],
				pricing: {
					student: '15.00',
					worker: '15.00',
					external: '15.00',
				},
				allergens: [],
			},
			{
				title: 'Burritos con carne de cerdo',
				description: ['Burritos con carne de cerdo'],
				pricing: {
					student: '15.00',
					worker: '15.00',
					external: '15.00',
				},
				allergens: [],
			},
			{
				title: 'Burritos con carne de pollo',
				description: ['Burritos con carne de pollo'],
				pricing: {
					student: '15.00',
					worker: '15.00',
					external: '15.00',
				},
				allergens: [],
			},
			{
				title: 'Burritos vegetarianos',
				description: ['Burritos vegetarianos'],
				pricing: {
					student: '12.00',
					worker: '12.00',
					external: '12.00',
				},
				allergens: [],
			},
			{
				title: 'Quesadillas con queso',
				description: ['Quesadillas con queso'],
				pricing: {
					student: '10.00',
					worker: '10.00',
					external: '10.00',
				},
				allergens: [],
			},
			{
				title: 'Quesadillas con queso y carne',
				description: ['Quesadillas con queso y carne'],
				pricing: {
					student: '15.00',
					worker: '15.00',
					external: '15.00',
				},
				allergens: [],
			},
			{
				title: 'Guacamole',
				description: ['Guacamole con Nachos'],
				pricing: {
					student: '10.00',
					worker: '10.00',
					external: '10.00',
				},
				allergens: [],
			},
		];
	}

	if (url === 'http://www.italsweet.ch/') {
		return [
			{
				title: 'Eis und Süsses',
				description: ['Gelateria', 'Dolceria', 'Creperia', 'Piadina-Bar'],
				pricing: null,
				allergens: [],
			},
		];
	}

	if (url === 'http://www.mirocoffee.co') {
		return [
			{
				title: 'Espresso',
				description: [],
				pricing: {
					student: '3.00',
					worker: '3.00',
					external: '3.00',
				},
				allergens: [],
			},
			{
				title: 'Tee',
				description: [],
				pricing: {
					student: '2.00',
					worker: '2.00',
					external: '2.00',
				},
				allergens: [],
			},
			{
				title: 'Latte Capp',
				description: [],
				pricing: {
					student: '3.50',
					worker: '3.50',
					external: '3.50',
				},
				allergens: [],
			},
			{
				title: 'Eiskaffee',
				description: [],
				pricing: {
					student: '3.50',
					worker: '3.50',
					external: '3.50',
				},
				allergens: [],
			},
			{
				title: 'Doppio',
				description: [],
				pricing: {
					student: '4.00',
					worker: '4.00',
					external: '4.00',
				},
				allergens: [],
			},
			{
				title: 'Brownie',
				description: [],
				pricing: {
					student: '3.00',
					worker: '3.00',
					external: '3.00',
				},
				allergens: [],
			},
		];
	}

	if (url === 'http://www.drueradkafi.ch') {
		return [
			{
				title: 'Kaffee und Gebäck',
				description: [
					'Kaffee',
					'Heisse und kalte Schokolade',
					'Mineral',
					'Gebäck',
				],
				pricing: null,
				allergens: [],
			},
		];
	}

	if (
		url ===
		'https://www.facebook.com/Ada-Lokma-VEGAN-und-VEGETARISCH-861850303935745/info/?ref=page_internal'
	) {
		return [
			{
				title: 'Köfte',
				description: [
					'grillierte Hackfleischbällchen mit Bulgur',
					'Tomaten (geraffelt), gebratene Zwiebeln & natürliche Gewürze und Kräuter',
				],
				pricing: {
					student: '13.00',
					worker: '13.00',
					external: '13.00',
				},
				allergens: [],
				swiss_meat: true,
			},
			{
				title: 'Sucuk Delikatessen-Döner-Kebab im Brot',
				description: ['Rindentrecote, Eigenproduktion', 'Halal'],
				pricing: {
					student: '10.00',
					worker: '10.00',
					external: '10.00',
				},
				allergens: [],
				swiss_meat: true,
			},
			{
				title: 'Sucuk Delikatessen-Döner-Kebab im Wrap',
				description: ['Rindentrecote, Eigenproduktion', 'Halal'],
				pricing: {
					student: '13.00',
					worker: '13.00',
					external: '13.00',
				},
				allergens: [],
				swiss_meat: true,
			},
			{
				title: 'Anatolien Wrap',
				description: [
					'Kichererbsen-Mus, Linsen-Mus, Bulgur, Paprika, Aubergine, Zucchetti, Tomaten-Sauce, Pfefferminz, Basilikum, Petersilien, Walnuss',
				],
				pricing: {
					student: '13.00',
					worker: '13.00',
					external: '13.00',
				},
				allergens: [],
				vegan: true,
			},
			{
				title: 'Zigarren-Börek',
				description: ['mit Feta-Käse und Petersilie'],
				pricing: {
					student: '10.00',
					worker: '10.00',
					external: '10.00',
				},
				allergens: [],
				vegetarian: true,
			},
			{
				title: 'Lokma',
				pricing: {
					student: '8.00',
					worker: '8.00',
					external: '8.00',
				},
				allergens: [],
				description: [
					'unsere Hausspezialität',
					'Teigbällchen mit Zuckersirup glasiert',
					'auf Wunsch mit Zimt und Walnuss bestreut',
				],
				vegan: true,
			},
			{
				title: 'Pommes',
				description: ['1 Portion'],
				pricing: {
					student: '5.00',
					worker: '5.00',
					external: '5.00',
				},
				allergens: [],
				vegan: true,
			},
		];
	}

	if (url === 'http://crown-of-india.ch/') {
		return [
			{
				title: 'Indische Gerichte',
				description: [
					'Kennst du das Menu für Crown of India?',
					'E-Mail an info@bestande.ch.',
				],
				allergens: [],
				pricing: null,
			},
		];
	}

	if (url === 'http://www.orientcatering.ch') {
		return [
			{
				title: 'Mezze Falafel',
				description: [],
				pricing: {
					student: '12.00',
					worker: '12.00',
					external: '12.00',
				},
				allergens: [],
			},
			{
				title: 'Falafel Wrap',
				description: [],
				pricing: {
					student: '8.00',
					worker: '8.00',
					external: '8.00',
				},
				allergens: [],
			},
			{
				title: 'Baklava',
				description: [],
				pricing: null,
				allergens: [],
			},
		];
	}

	if (url === 'http://ilmacchinista.ch/') {
		return [
			{
				title: 'Kaffeegetränke aller Art',
				description: [
					'Espresso',
					'Ristretto',
					'Latte Macchiato',
					'Cappuccino',
					'Flat White',
					'Eiskaffee',
					'Chai und Tee',
					'etc.',
				],
				allergens: [],
				pricing: {
					student: '3.00-4.50',
					worker: '3.00-4.50',
					external: '3.00-4.50',
				},
			},
			{
				title: 'Gebäck',
				description: [],
				allergens: [],
				pricing: null,
			},
		];
	}

	if (url === 'http://www.kaffeeundkamele.ch/') {
		return [
			{
				title: 'Espresso',
				description: [],
				pricing: {
					student: '3.50',
					worker: '3.50',
					external: '3.50',
				},
				allergens: [],
			},
			{
				title: 'Doppio / Chai',
				description: [],
				pricing: {
					student: '4.50',
					worker: '4.50',
					external: '4.50',
				},
				allergens: [],
			},
			{
				title: 'Cappuccino',
				description: [],
				pricing: {
					student: '4.00',
					worker: '4.00',
					external: '4.00',
				},
				allergens: [],
			},
			{
				title: 'Cafe Latte',
				description: [],
				pricing: {
					student: '4.00',
					worker: '4.00',
					external: '4.00',
				},
				allergens: [],
			},
			{
				title: 'Flat White Teacups',
				description: [],
				pricing: {
					student: '4.50',
					worker: '4.50',
					external: '4.50',
				},
				allergens: [],
			},
			{
				title: 'Frischer Minztee',
				description: [],
				pricing: {
					student: '4.00',
					worker: '4.00',
					external: '4.00',
				},
				allergens: [],
			},
			{
				title: 'Weitere Angebote',
				description: [
					'Feinstes Gebäck',
					'Homemade Ice Tea',
					'Eiskaffees',
					'Gelati',
				],
				allergens: [],
				pricing: null,
			},
		];
	}

	if (url === 'http://www.aess-bar.ch/') {
		return [
			{
				title: 'Gipfeli und Brötchen',
				description: [],
				pricing: {
					student: 'ab 0.50',
					worker: 'ab 0.50',
					external: 'ab 0.50',
				},
				allergens: [],
			},
			{
				title: 'Süssgebäck und Patisserie',
				description: [],
				pricing: {
					student: 'ab 1.00',
					worker: 'ab 1.00',
					external: 'ab 1.00',
				},
				allergens: [],
			},
			{
				title: 'Brote, Zöpfe',
				description: [],
				pricing: {
					student: 'ab 2.00',
					worker: 'ab 2.00',
					external: 'ab 2.00',
				},
				allergens: [],
			},
			{
				title: 'Sandwiches',
				description: [],
				pricing: {
					student: 'ab 2.50',
					worker: 'ab 2.50',
					external: 'ab 2.50',
				},
				allergens: [],
			},
			{
				title: 'Getränke',
				description: [
					'Kaffee & Tee',
					'Softdrinks & Ice Teas',
					'Fruchtsäfte',
					'Wasser gratis',
				],
				allergens: [],

				pricing: {
					student: '3.00',
					worker: '3.00',
					external: '3.00',
				},
			},
		];
	}

	if (url === 'http://www.barcaffetteria-otter.ch/wb/') {
		return [
			{
				title: 'Cafetteria',
				description: [
					'Espresso',
					'Cappuccino',
					'Latte Macchiato',
					'Caffè Latte',
					'Café Crème',
					'Diverse Tee',
					'Heisse Schokolade',
					'Ovomaltine',
					'Eiskaffee im Sommer',
					'Glühwein im Winter',
					'Hausgemachte Kuchen',
				],
				allergens: [],
				pricing: null,
			},
		];
	}

	if (url === 'http://www.tasteofparadise.ch/') {
		return [
			{
				title: 'Taste of Paradise',
				description: ['Indische, asiatische, thailändische Spezialitäten'],
				allergens: [],
				pricing: null,
			},
		];
	}

	if (url === 'http://www.calleri.ch/') {
		return [
			{
				title: 'Kebab im Taschenbrot',
				description: [],
				pricing: {
					student: '8.50',
					worker: '8.50',
					external: '8.50',
				},
				allergens: [],
			},
			{
				title: 'Kebab im Fladenbrot',
				description: [],
				pricing: {
					student: '8.50',
					worker: '8.50',
					external: '8.50',
				},
				allergens: [],
			},
			{
				title: 'Falafel',
				description: [],
				pricing: {
					student: '8.00',
					worker: '8.00',
					external: '8.00',
				},
				allergens: [],
			},
			{
				title: 'Deluxe Döner Box',
				description: [],
				pricing: {
					student: '9.90',
					worker: '9.90',
					external: '9.90',
				},
				allergens: [],
			},
			{
				title: 'Dürüm mit Pommes',
				description: [],
				pricing: {
					student: '9.90',
					worker: '9.90',
					external: '9.90',
				},
				allergens: [],
			},
			{
				title: 'Hamburger',
				description: [],
				pricing: {
					student: '7.00',
					worker: '7.00',
					external: '7.00',
				},
				allergens: [],
			},
			{
				title: 'Kebab und Getränk',
				description: [],
				pricing: {
					student: '10.00',
					worker: '10.00',
					external: '10.00',
				},
				allergens: [],
			},
			{
				title: 'Focaccia',
				description: [],
				pricing: {
					student: '6.00',
					worker: '6.00',
					external: '6.00',
				},
				allergens: [],
			},
			{
				title: 'Pizza',
				description: [],
				pricing: {
					student: '5.00',
					worker: '5.00',
					external: '5.00',
				},
				allergens: [],
			},
			{
				title: 'Impanante',
				description: [],
				pricing: {
					student: '8.00',
					worker: '8.00',
					external: '8.00',
				},
				allergens: [],
			},
			{
				title: 'Arancini',
				description: [],
				pricing: {
					student: '5.50',
					worker: '5.50',
					external: '5.50',
				},
				allergens: [],
			},
			{
				title: 'Deluxe Potatoes',
				description: [],
				pricing: {
					student: '5.50',
					worker: '5.50',
					external: '5.50',
				},
				allergens: [],
			},
		];
	}

	if (url === 'https://www.pizzamobil.ch/') {
		return [
			{
				title: 'Pizza Volpe',
				description: ['Holzofen-Pizze'],
				allergens: [],
				pricing: null,
			},
		];
	}

	if (url === 'https://de-de.facebook.com/pitagyrosbySF/') {
		return [
			{
				title: 'Pita Gyros',
				description: [],
				pricing: {
					student: '12.00',
					worker: '12.00',
					external: '12.00',
				},
				allergens: [],
			},
			{
				title: 'Pita Halloumi',
				vegetarian: true,
				description: [],
				pricing: {
					student: '12.00',
					worker: '12.00',
					external: '12.00',
				},
				allergens: [],
			},
			{
				title: 'Gyros Teller',
				description: [],
				pricing: {
					student: '15.00',
					worker: '15.00',
					external: '15.00',
				},
				allergens: [],
			},
			{
				title: 'Halloumi Teller',
				description: [],
				pricing: {
					student: '15.00',
					worker: '15.00',
					external: '15.00',
				},
				allergens: [],

				vegetarian: true,
			},
			{
				title: 'Greco Pommes',
				description: [],
				pricing: {
					student: '6.00',
					worker: '6.00',
					external: '6.00',
				},
				allergens: [],
			},
		];
	}

	if (url === 'https://meatandgreet.ch/index.html') {
		return [
			{
				title: 'Regi-Burger Classic',
				description: [
					'Rindfleisch Patty (135gr.)',
					'Vollkorn Brötchen, Rucola, Salat, Tomaten, Zwiebel, Hausgemachte Burgersauce',
				],
				allergens: [],

				pricing: {
					student: '12.00',
					worker: '12.00',
					external: '12.00',
				},
			},
			{
				title: 'Regi-Burger Cheese',
				description: [
					'Rindfleisch Patty (135gr.)',
					'Portion Raclette-Käse',
					'Vollkorn Brötchen, Rucola, Salat, Tomaten, Zwiebel, Hausgemachte Burgersauce',
				],
				allergens: [],

				pricing: {
					student: '14.00',
					worker: '14.00',
					external: '14.00',
				},
			},
			{
				title: 'Regi-Burger Bacon',
				description: [
					'Rindfleisch Patty (135gr.)',
					'Geräucherter Freilandsauspeck',
					'Vollkorn Brötchen, Rucola, Salat, Tomaten, Zwiebel, Hausgemachte Burgersauce',
				],
				allergens: [],

				pricing: {
					student: '14.00',
					worker: '14.00',
					external: '14.00',
				},
			},
			{
				title: 'Regi-Burger Deluxe',
				description: [
					'Rindfleisch Patty (135gr.)',
					'Raclette-Käse & Freilandsauspeck',
					'Vollkorn Brötchen, Rucola, Salat, Tomaten, Zwiebel, Hausgemachte Burgersauce',
				],
				allergens: [],

				pricing: {
					student: '16.00',
					worker: '16.00',
					external: '16.00',
				},
			},
			{
				title: 'Regi-Burger Vegi',
				description: [
					'Bio-Gemüse Patty',
					'Vollkorn Brötchen, Rucola, Salat, Tomaten, Zwiebel',
					'Hausgemachte Burgersauce',
				],
				allergens: [],

				pricing: {
					student: '12.00',
					worker: '12.00',
					external: '12.00',
				},
			},
			{
				title: 'Country Cuts',
				description: ['Frittierte Kartoffelschnitze'],
				allergens: [],

				pricing: {
					student: '6.00',
					worker: '6.00',
					external: '6.00',
				},
			},
		];
	}

	if (url === 'https://www.flammwerk.ch/') {
		return [
			{
				title: 'Flammkuchen Vegi',
				description: ['Gemüsewürfel, Zwiebel, Käse'],
				pricing: {
					student: '10.00',
					worker: '10.00',
					external: '10.00',
				},
				allergens: [],
			},
			{
				title: 'Flammkuchen Parma',
				description: ['Mozarella, Rucola, Rohschinken'],
				pricing: {
					student: '9.50',
					worker: '9.50',
					external: '9.50',
				},
				allergens: [],
			},
			{
				title: 'Flammkuchen Normandie',
				description: ['Apfel, Zimt'],
				pricing: {
					student: '9.50',
					worker: '9.50',
					external: '9.50',
				},
				allergens: [],
			},
		];
	}

	if (url === 'http://www.alumnilounge.ch/de.html') {
		return [
			{
				title: 'Schnitzel-Sandwiches',
				description: [],
				allergens: [],
				pricing: null,
			},
		];
	}

	if (url === 'http://www.rhystorante.ch/') {
		return [
			{
				title: 'Ox-Beef-Burger',
				description: [
					'Delikate Rindshuftstreifen (vom Ochsen) mit caramelisierten Zwiebeln',
					'Weiss-, Rotkohl- & Karottensalat im handgemachten Ciabatta-Brot',
					'als Variante mit Käse oder, und Speck',
				],
				allergens: [],
				pricing: null,
			},
			{
				title: 'Fresh Chips',
				description: [
					'Frische vor Ort hergestellte Kartoffelchips mit 6 - 7 verschiedenen Gewürzen',
				],
				allergens: [],
				pricing: null,
			},
			{
				title: 'Vegi-Lunch',
				description: [
					'Frische, grillierte Zucchini und Peperoni mit Provolone (ital. Käse)',
					'Rucola im handgemachten Ciabatta-Brot',
				],
				allergens: [],
				pricing: null,
			},
		];
	}

	if (url === 'https://chuchi-chäschtli.org/') {
		return [
			{
				title: 'Leberkäässemmel',
				description: [],
				pricing: null,
				allergens: [],
			},
			{
				title: 'Pizza Leberkääs',
				description: [],
				pricing: null,
				allergens: [],
			},
			{
				title: 'Leberkääs Cordon Bleu',
				description: [],
				pricing: null,
				allergens: [],
			},
			{
				title: 'Krustenbratensemmel',
				description: [],
				pricing: null,
				allergens: [],
			},
			{
				title: 'Fleischpflanzarlsemmel',
				description: [],
				pricing: null,
				allergens: [],
			},
			{
				title: 'Schnitzel Semmel',
				description: [],
				pricing: null,
				allergens: [],
			},
			{
				title: '1/2 Meterwurst',
				description: [],
				pricing: null,
				allergens: [],
			},
			{
				title: 'Rindswurst mit Kääs',
				description: [],
				pricing: null,
				allergens: [],
			},
			{
				title: 'Currywurst rot',
				description: ['weiss / rot'],
				pricing: null,
				allergens: [],
			},
			{
				title: 'Currywurst',
				description: [],
				pricing: null,
				allergens: [],
			},
			{
				title: 'Süsskartoffel Pommes',
				description: [],
				pricing: null,
				allergens: [],
			},
			{
				title: 'Pommes normal',
				description: [],
				pricing: null,
				allergens: [],
			},
			{
				title: 'Brezel',
				description: [],
				pricing: null,
				allergens: [],
			},
			{
				title: 'Obadza (Käseaufstrich)',
				description: [],
				pricing: null,
				allergens: [],
			},
			{
				title: 'Kartoffelsalat Classic',
				description: [],
				pricing: null,
				allergens: [],
			},
			{
				title: 'Kartoffelsalat Bayerisch',
				description: [],
				pricing: null,
				allergens: [],
			},
			{
				title: 'Krautsalat',
				description: [],
				pricing: null,
				allergens: [],
			},
		];
	}

	if (url === 'http://www.rollingfood.ch/') {
		return [
			{
				title: 'Loves Menu (Baked Potatoes)',
				description: [
					'Kumpir nach Wahl',
					'Getränk nach Wahl',
					'Tagessalat',
					'Tagesdessert',
				],
				allergens: [],
				pricing: {
					student: '20.00',
					worker: '25.00',
					external: '25.00',
				},
			},
		];
	}

	if (url === 'http://www.natura-gueggeli.ch/') {
		// gegenüber Ticketbox, 11:00 - 22:00
		return [
			{
				allergens: [],
				pricing: null,
				title: 'Natura Güggeli',
				description: ['ganz oder halb'],
			},
			{
				allergens: [],
				pricing: null,

				title: 'Poulet-Schenkel',
				description: [],
			},
			{
				allergens: [],
				pricing: null,

				title: 'Poulet-Flügeli Portion',
				description: [],
			},
			{
				allergens: [],
				pricing: null,

				title: 'Poulet-Feuersteak',
				description: [],
			},
			{
				allergens: [],
				pricing: null,

				title: 'Poulet Feuerspiess',
				description: [],
			},
			{
				allergens: [],
				pricing: null,

				title: 'Poulet-Jägersteak',
				description: [],
			},
			{
				allergens: [],
				pricing: null,

				title: 'Poulet-Partyspiess',
				description: [],
			},
			{
				allergens: [],
				pricing: null,

				title: 'Geflügel-Bratwurst',
				description: [],
			},
			{
				allergens: [],
				pricing: null,

				title: 'Geflügel-Cervelas',
				description: [],
			},
			{
				allergens: [],
				pricing: null,

				title: 'Chick-n-Pick Schnitzelbrot',
				description: [],
			},
			{
				allergens: [],
				pricing: null,

				title: 'Chicken-n-Dog',
				description: [],
			},
			{
				allergens: [],
				pricing: null,

				title: 'Country Cuts',
				description: [],
			},
			{
				allergens: [],
				pricing: null,

				title: 'Pommes frites',
				description: [],
			},
		];
	}

	if (url === 'http://falafel-vegan.ch/') {
		// zwischen 10.00 und 14.00
		return [
			{
				title: 'Falafel Sandwish',
				description: [],
				allergens: [],
				pricing: null,
			},
			{
				title: 'Falafel Box',
				description: [],
				allergens: [],
				pricing: null,
			},
			{
				title: 'Falafel Teller',
				description: [],
				allergens: [],
				pricing: null,
			},
			{
				title: 'Tabouleh Salat',
				description: [],
				allergens: [],
				pricing: null,
			},
			{
				title: 'Hummus',
				description: [],
				allergens: [],
				pricing: null,
			},
			{
				title: 'Pommes',
				description: [],
				allergens: [],
				pricing: null,
			},
		];
	}

	if (url === 'https://www.kempers.swiss/') {
		// Zeit: 11:00-14:00
		return [
			{
				title: 'Original Berliner Currywurst',
				description: ['inkl. Ketchup + Currywurst'],
				pricing: {
					student: '6.00',
					worker: '6.00',
					external: '6.00',
				},
				allergens: [],
			},
			{
				title: 'BIO-Currywurst',
				description: ['inkl. Ketchup + Currywurst'],
				pricing: {
					student: '7.00',
					worker: '7.00',
					external: '7.00',
				},
				allergens: [],

				swiss_meat: true,
			},
			{
				title: "BIO-Boulette 'Hacktätschli'",
				description: ['100% BIO-Rindfleisch'],
				pricing: {
					student: '8.00',
					worker: '8.00',
					external: '8.00',
				},
				allergens: [],

				swiss_meat: true,
			},
			{
				title: 'BIO-Hotdog',
				description: ['100% BIO-Schweinefleisch'],
				pricing: {
					student: '7.00',
					worker: '7.00',
					external: '7.00',
				},
				allergens: [],

				swiss_meat: true,
			},
			{
				title: '1 Paar BIO-Wienerli',
				description: ['100% Bio-Schweinefleisch'],
				pricing: {
					student: '7.00',
					worker: '7.00',
					external: '7.00',
				},
				allergens: [],

				swiss_meat: true,
			},
			{
				title: 'BIO-Fleischspiess',
				description: ['100% Bio-Rindfleisch'],
				pricing: {
					student: '10.00',
					worker: '10.00',
					external: '10.00',
				},
				allergens: [],

				swiss_meat: true,
			},
			{
				title: 'BIO-Bouletten Burger',
				description: [
					'mit Bio-Cocktail- oder',
					'Joghurt-Kräuter-Sauce',
					'100% Bio-Rindfleisch',
				],
				allergens: [],

				pricing: {
					student: '13.00',
					worker: '13.00',
					external: '13.00',
				},
				swiss_meat: true,
			},
			{
				title: 'BIO-Salat',
				vegetarian: true,
				description: [],
				pricing: {
					student: '7.50',
					worker: '7.50',
					external: '7.50',
				},
				allergens: [],
			},
			{
				title: 'BIO-Salat mit Schafkäse',
				vegetarian: true,
				description: [],
				pricing: {
					student: '9.00',
					worker: '9.00',
					external: '9.00',
				},
				allergens: [],
			},
			{
				title: 'BIO-Obstsalat',
				description: ['Saisonales Bio-Obst geschnitten'],
				pricing: {
					student: '5.00',
					worker: '5.00',
					external: '5.00',
				},
				allergens: [],
			},
			{
				title: 'Pommes Frites klein',
				description: ['mit Ketchup oder Mayo'],
				pricing: {
					student: '4.00',
					worker: '4.00',
					external: '4.00',
				},
				allergens: [],
			},
			{
				title: 'Pommes Frites gross',
				description: ['mit Ketchup oder Mayo'],
				pricing: {
					student: '5.50',
					worker: '5.50',
					external: '5.50',
				},
				allergens: [],
			},
			{
				title: 'Schrippe',
				description: ['Brötchen Schweiz'],
				pricing: {
					student: '1.00',
					worker: '1.00',
					external: '1.00',
				},
				allergens: [],
			},
			{
				title: 'Bio-Limonaden und -cola',
				description: [
					'Natur-Cola mit Guarana',
					'Natur-Cola + Orange',
					'Zitrone-Ingwer naturtrüb',
					'Rhabarber naturtrüb',
					'Kirsche + Granatapfel',
					'Orangenlimonade',
					'Maracuja + Orange',
					'Apfelschorle',
				],
				allergens: [],

				pricing: {
					student: '3.50',
					worker: '3.50',
					external: '3.50',
				},
			},
			{
				title: 'Mineralwassser',
				description: ['mit / ohne Kohlensäure', '0.5l'],
				pricing: {
					student: '3.50',
					worker: '3.50',
					external: '3.50',
				},
				allergens: [],
			},
			{
				title: 'Espresso',
				description: [],
				pricing: {
					student: '3.00',
					worker: '3.00',
					external: '3.00',
				},
				allergens: [],
			},
		];
	}

	return [];
};

export const parseEthMensaStreetfood = (html) => {
	const $ = cheerio.load(html);
	const center = $('table').eq(0);
	const hoenggerberg = $('table').eq(1);

	const trs = [center, hoenggerberg].map((table) => {
		let day: string | null = null;
		return $(table)
			.find('tr')
			.map((i, tr) => {
				const cells = $(tr).find('td');
				if (cells.length === 0) {
					return null;
				}

				day = cells.eq(0).text().trim() || day;
				const provider = cells.eq(1).text();
				const providerLink = cells.eq(1).find('a').attr('href');
				const offer = cells.eq(2).text();
				const location = cells.eq(3).text();
				return {
					day,
					provider,
					providerLink,
					offer,
					location,
				};
			})
			.toArray()
			.filter(truthy);
	});
	return trs;
};
