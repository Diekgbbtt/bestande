import cartesian from 'cartesian';

const alternatives = [
	['1', 'i'],
	['2', 'ii'],
	['3', 'iii'],
	['mathe', 'mathematik'],
	['bwl', 'betriebswirtschaftslehre'],
	['vwl', 'volkswirtschaftslehre'],
	['mikro', 'mikroökonomik'],
	['makro', 'makroökonomik'],
	['bf', 'banking and finance'],
	['ma', 'managerial accounting'],
	['qwg', 'Quantitative Wirtschaftsgeschichte'],
	['kv', 'krankenversicherung'],
	['ewf', 'empirische wirtschaftsforschung'],
	['cf', 'corporate finance'],
];

const permutable = (token: string) => {
	return alternatives.find(
		(a) =>
			a[0] === token.toLowerCase() || a[1].toLowerCase() === token.toLowerCase()
	);
};

const getPermutations = (input: string | null): string[] => {
	if (!input) {
		return [];
	}

	const splitted = input.split(' ');
	const map = splitted.map((s) => permutable(s) || s);
	return cartesian(map).map((a: string[]) => a.join(' '));
};

export default getPermutations;
