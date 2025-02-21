import ethMensa from './eth-mensa';
import uzhMensa, {Mensa, SingleCanteen} from './uzh-mensa';

const mensi: Mensa[] = [
	{
		name: 'Zentrum',
		id: 'zentrum-both',
		institution: null,
		mensa: [
			...(uzhMensa.find((m) => m.id === 'main-building')
				?.mensa as SingleCanteen[]),
			...(ethMensa.find((m) => m.id === 'eth-main-building')
				?.mensa as SingleCanteen[]),
		],
	},
];

export default mensi;
