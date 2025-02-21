import {Credit} from '../models/credit';
import {getModuleId} from './get-module-id';

export const schedulecacheKey = (credit: Credit, semester: string): string => {
	return ['schedule', getModuleId(credit), semester].join('-');
};
