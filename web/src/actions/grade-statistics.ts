import {Institution} from '../../../core/models/credit';

export const STATISTIC_MODULE_REQUEST = 'STATISTIC_MODULE_REQUEST';
export const STATISTIC_MODULE_RESPONSE = 'STATISTIC_MODULE_RESPONSE';
export const STATISTIC_MODULE_ERROR = 'STATISTIC_MODULE_ERROR';

export type GradeModuleRequest = {
	type: 'STATISTIC_MODULE_REQUEST';
	uni_identifier: string;
	university: Institution;
};

export type GradeModuleResponse = {
	type: 'STATISTIC_MODULE_RESPONSE';
	uni_identifier: string;
	university: Institution;
	stats: any;
};

export type GradeModuleError = {
	type: 'STATISTIC_MODULE_ERROR';
	uni_identifier: string;
	university: Institution;
	error: Error;
};
