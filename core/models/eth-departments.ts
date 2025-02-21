export type Department =
	| 'D-ARCH'
	| 'D-BAUG'
	| 'D-MAVT'
	| 'D-INFK'
	| 'D-MTEC'
	| 'D-MATH'
	| 'D-PHYS'
	| 'D-BIOL'
	| 'D-ERDW'
	| 'D-GESS'
	| 'D-ITET'
	| 'D-MATL'
	| 'D-CHAB'
	| 'D-BSSE'
	| 'D-HEST'
	| 'D-USYS';

const departments: {[key: number]: Department} = {
	1: 'D-ARCH',
	2: 'D-BAUG',
	3: 'D-MAVT',
	5: 'D-INFK',
	7: 'D-MTEC',
	8: 'D-MATH',
	9: 'D-PHYS',
	11: 'D-BIOL',
	13: 'D-ERDW',
	17: 'D-GESS',
	18: 'D-ITET',
	19: 'D-MATL',
	20: 'D-CHAB',
	23: 'D-BSSE',
	24: 'D-HEST',
	25: 'D-USYS',
};

export default departments;
