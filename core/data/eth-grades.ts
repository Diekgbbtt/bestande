import {GradeStatistic} from '../types/grade-statistics';

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

const springAiv: Omit<
	GradeStatistic & {
		uni_identifier: string;
		period: number;
	},
	'stddev' | 'semester' | 'count'
>[] = [
	// http://www.aiv.ethz.ch/wp/wp-content/uploads/2009/09/NAIV-FS181.pdf
	{
		uni_identifier: '401-0243-00L', // Analysis III
		passed: 97,
		failed: 21,
		average: 4.58,
		source: 'NAIV FS18',
		period: 20172,
		comment: null,
		source_link: null,
	},
	{
		uni_identifier: '101-0203-01L',
		passed: 109,
		failed: 9,
		average: 5.16,
		source: 'NAIV FS18',
		period: 20172,
		comment: null,
		source_link: null,
	},
	{
		uni_identifier: '402-0023-01L',
		passed: 83,
		failed: 25,
		average: 4.34,
		source: 'NAIV FS18',
		period: 20172,
		comment: null,
		source_link: null,
	},
	{
		uni_identifier: '102-0293-00L', // Hydrology
		passed: 110,
		failed: 17,
		average: 4.47,
		source: 'NAIV FS18',
		period: 20172,
		comment: null,
		source_link: null,
	},
	{
		uni_identifier: '101-0315-00L', // Grundbau
		passed: 110,
		failed: 17,
		average: 4.69,
		source: 'NAIV FS18',
		period: 20172,
		comment: null,
		source_link: null,
	},
	{
		uni_identifier: '101-0031-01L',
		passed: 116,
		failed: 11,
		average: 4.79,
		source: 'NAIV FS18',
		period: 20172,
		comment: null,
		source_link: null,
	},
	{
		uni_identifier: '101-0134-00L',
		passed: 90,
		failed: 37,
		average: 4.1,
		source: 'NAIV FS18 (mit Stahlbau II)',
		period: 20171,
		comment: null,
		source_link: null,
	},
	{
		uni_identifier: '101-0135-01L',
		passed: 90,
		failed: 37,
		average: 4.1,
		source: 'NAIV FS18 (mit Stahlbau I)',
		period: 20172,
		comment: null,
		source_link: null,
	},
	/*
	{
		uni_identifier: 'Verkehr II',
		passed: 100,
		failed: 27,
		average: 4.5,
		source: 'NAIV FS18 ',
		period: 20172
	}
	*/
	// http://www.aiv.ethz.ch/wp/wp-content/uploads/2017/06/NAIV-FS17_small.pdf
	{
		uni_identifier: '401-0243-00L',
		passed: 129,
		failed: 3,
		average: 5.01,
		source: 'NAIV FS17',
		period: 20162,
		comment: null,
		source_link: null,
	},
	{
		uni_identifier: '101-0203-01L',
		passed: 102,
		failed: 30,
		average: 4.44,
		source: 'NAIV FS17',
		period: 20162,
		comment: null,
		source_link: null,
	},
	{
		uni_identifier: '402-0023-01L',
		passed: 105,
		failed: 27,
		average: 4.65,
		source: 'NAIV FS17',
		period: 20162,
		comment: null,
		source_link: null,
	},
	{
		uni_identifier: '102-0293-00L',
		passed: 64,
		failed: 29,
		average: 4.45,
		source: 'NAIV FS17',
		period: 20162,
		comment: null,
		source_link: null,
	},
	{
		uni_identifier: '101-0315-00L',
		passed: 69,
		failed: 24,
		average: 4.42,
		source: 'NAIV FS17',
		period: 20162,
		comment: null,
		source_link: null,
	},
	{
		uni_identifier: '101-0031-01L',
		passed: 87,
		failed: 6,
		average: 5.06,
		source: 'NAIV FS17',
		period: 20162,
		comment: null,
		source_link: null,
	},
	{
		uni_identifier: '101-0134-00L',
		passed: 64,
		failed: 29,
		average: 3.99,
		source: 'NAIV FS17 (mit Stahlbau II)',
		period: 20161,
		comment: null,
		source_link: null,
	},
	{
		uni_identifier: '101-0135-01L',
		passed: 85,
		failed: 8,
		average: 4.42,
		source: 'NAIV FS17 (mit Stahlbau I)',
		period: 20162,
		comment: null,
		source_link: null,
	},
];

export const ethGrades = [...springAiv];
