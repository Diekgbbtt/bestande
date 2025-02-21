import {CustomModule, Institution} from '../models/credit';

export const makeModuleCollection = ({
	uni_identifier,
	university,
	name,
	credits_worth,
	period,
	short_name,
}: {
	uni_identifier: string;
	university: Institution;
	name: string;
	period: number;
	short_name: string;
	credits_worth: string | number | null;
}): CustomModule => {
	return {
		uni_identifier,
		university,
		name,
		period,
		short_name,
		credits_worth,
	};
};
