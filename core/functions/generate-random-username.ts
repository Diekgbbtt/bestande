const combo1 = [
	'bqm',
	'asvz',
	'lichthof',
	'irchel',
	'poly',
	'vorlesungs',
	'philo',
	'bwl',
	'psycho',
	'pruefungs',
	'oerlikon',
	'bibliothek',
	'library',
	'einstein',
	'züri',
	'awesome',
	'lern',
	'mensa',
	'ehren',
	'hsg',
	'limmat',
	'lost',
];

const combo2 = [
	'Hänger',
	'Master',
	'Bachelor',
	'Fan',
	'Enthusiast',
	'Beast',
	'Chiller',
	'Aktivist',
	'Influencer',
	'Aficionado',
	'Boy',
	'Girl',
	'Dude',
	'Man',
	'Woman',
	'Professor',
	'Doktor',
	'Avocado',
	'Banana',
	'Spaghetti',
	'Hipster',
	'Star',
	'Tourist',
	'Kebab',
	'Mensch',
	'Boomer',
];

const combo3 = new Array(20).fill(true).map((i, idx) => String(idx));

const capitalize = (str: string): string => {
	return str
		.split('')
		.map((s, i) => (i === 0 ? s.toUpperCase() : s.toLowerCase()))
		.join('');
};

const maybeCapitalize = (str: string) => {
	if (Math.random() < 0.5) {
		return capitalize(str);
	}

	return str.toLowerCase();
};

const sample = (arr: string[], without: string[]): string | undefined => {
	const length = arr === null ? 0 : arr.length;
	const pickedWord = arr[Math.floor(Math.random() * length)];
	if (without.includes(pickedWord)) {
		return sample(arr, without);
	}

	return length ? pickedWord : undefined;
};

export const getRandomUsername = (n: number) => {
	let usedWords: string[] = [];
	let phrases: string[] = [];
	for (let i = 0; i < n; i++) {
		const one = sample(combo1, usedWords) as string;
		const two = sample(combo2, usedWords) as string;
		const three = sample(combo3, usedWords) as string;

		usedWords = [...usedWords, one, two, three];
		phrases = [...phrases, maybeCapitalize(one) + maybeCapitalize(two) + three];
	}

	return phrases;
};
