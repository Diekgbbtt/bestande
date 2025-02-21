import {Credit} from '../models/credit';
import {ApiResponse} from '../reducers/api';

export const cannotNavigate = (credit: Credit | ApiResponse): boolean => {
	return (
		!(credit as any).link &&
		(!(credit as any).institution || !credit.uni_identifier) &&
		(!credit.university || !credit.uni_identifier)
	);
};
