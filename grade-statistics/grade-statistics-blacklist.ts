import {Institution} from '../core/models/credit';
import {UZH} from '../core/models/university';

type GradeStatisticBlackList = {
	uni_identifier: string;
	university: Institution;
};

const gradeStatisticsBlackList: GradeStatisticBlackList[] = [
	{
		uni_identifier: '50327239',
		university: UZH,
	},
	{
		uni_identifier: '50987904',
		university: UZH,
	},
];

export const isModuleInBlacklist = (
	institution: Institution,
	identifier: string
) => {
	return gradeStatisticsBlackList.find(
		(b) => b.university === institution && b.uni_identifier === identifier
	);
};
