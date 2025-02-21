import {Institution, PeriodHuman} from '../models/credit';
import {GradStatsSummary, TranslatedName} from '../models/module';
import {ModuleType} from '../models/module-type';
import {UZHFaculty} from '../models/uzh-faculties';

export type AlgoliaRange = {
	min?: number;
	max?: number;
};
export type AlgoliaCreditResult = {
	credits: number;
	faculty?: UZHFaculty;
	gradeStatistics?: GradStatsSummary;
	departments?: string[] | null;
	name: string;
	objectID: string;
	passRate: number;
	popularity: number;
	ratingSummary?: {average: number; total: number};
	semester: PeriodHuman[];
	short_name: string;
	translatedNames?: TranslatedName[];
	slug: string[];
	terms: string[];
	type: ModuleType;
	uni_identifier: string;
	university: Institution;
	users: number;
};
