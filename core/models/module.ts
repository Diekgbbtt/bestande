import sortBy from 'lodash/sortBy';
import {ApiResponse, SemesterResponse} from '../../core/reducers/api';
import getPermutations from '../functions/alternative-writings';
import {immutableReverse} from '../functions/immutable-reverse';
import {mapToUniSlug} from '../functions/uni-slug';
import {periodToString} from '../functions/uzh-period';
import {ImageType} from '../types/image';
import {AppLanguage} from './app-language';
import {Institution} from './credit';
import {Department} from './eth-departments';
import {EthFaculty} from './eth-faculties';
import {ModuleType} from './module-type';
import {RawRelatedModule} from './raw-related-module';
import Semester from './semester';
import {UZHFaculty} from './uzh-faculties';

export type ModulePreview = {
	university: Institution;
	name: string;
	short_name: string;
	uni_identifier: string;
	userCount?: {
		all: number;
	};
	type: ModuleType;
	ratingSummary?: {
		average: number | null;
		total: number | null;
	};
	gradeStatistics?: GradStatsSummary;
	faculty: UZHFaculty;
	semesters: SemesterResponse[];
	courseCode?: CourseCode | null;
};
type CountSemester = {
	period: number;
	count: number;
};

export type UserCount = {
	all: number | null;
	semester?: CountSemester[];
};

export type GradStatsSummary = {
	passed: number | null;
	failed: number | null;
	count: number | null;
	average: number | null;
};

export type RatingSummary = {
	average: number | null;
	total: number | null;
};

const moduleGetSlugOrId = (mod: Module | ApiResponse) => {
	if (mod.slug && mod.slug.length > 0) {
		return mod.slug?.[0];
	}

	return mod.uni_identifier;
};

export const moduleGetUrl = (mod: Module | ApiResponse) => {
	return `/${mapToUniSlug(mod.university)}/${moduleGetSlugOrId(mod)}`;
};

const getCredits = (mod: Module): number | null => {
	if (!mod.semesters.length) {
		return null;
	}

	const newestSemester = sortBy(mod.semesters, (s) => s.period).reverse()[0];

	if (!newestSemester.credits) {
		return 0;
	}

	return parseInt(String(newestSemester.credits), 10);
};

export const getSearchModel = (mod: Module) => {
	return {
		university: mod.university,
		name: mod.name,
		short_name: mod.short_name,
		uni_identifier: mod.uni_identifier,
		semester: mod.semesters.map((s) => periodToString(s.period)),
		slug: mod.slug,
		faculty: mod.faculty,
		departments: mod.departments,
		type: mod.type,
		users: mod.userCount ? mod.userCount.all : 0,
		popularity: mod.userCount?.all ? mod.userCount.all : 1,
		messages: mod.messages,
		credits: getCredits(mod),
		terms: [mod.short_name, ...getPermutations(mod.name)],
		gradeStatistics: mod.gradeStatistics,
		ratingSummary: mod.ratingSummary,
		courseCode: mod.courseCode,
		translatedNames: mod.translatedNames,
		passRate:
			mod.gradeStatistics?.count && mod.gradeStatistics.passed
				? (mod.gradeStatistics.passed / mod.gradeStatistics.count) * 100
				: null,
	};
};

export type CourseCode = {
	series: string;
	identifier: string;
	display: boolean;
	sortable_identfier: string;
};

export type SingleWebModuleState = {
	loading: boolean;
	data: ApiResponse | null;
	error: null | Error;
	semester: string | null;
	saving: boolean;
	resolved: string | null;
};

export type WebModuleState = {
	[key: string]: SingleWebModuleState;
};

export type TranslatedName = {language: AppLanguage; value: string};
class Module {
	university: Institution;
	name: string | null;
	short_name: string | null;
	uni_identifier: string;
	semesters: Semester[];
	slug: string[];
	userCount: UserCount;
	messages?: number | null;
	courseCode: CourseCode | null;
	gradeStatistics: GradStatsSummary;
	ratingSummary: RatingSummary;
	type: ModuleType | null;
	header_image: ImageType | null;
	translatedNames?: TranslatedName[];
	faculty: UZHFaculty | EthFaculty | null;
	departments: Department[] | null;
	related?: {
		previous: RawRelatedModule[];
		next: RawRelatedModule[];
		same: RawRelatedModule[];
	};

	constructor(data: {
		university: Institution;
		name?: string | null;
		short_name?: string | null;
		uni_identifier: string;
		semesters?: (Semester | SemesterResponse)[];
		slug?: string[];
		type?: ModuleType | null;
		translatedNames?: TranslatedName[];
		userCount?: {
			all: number | null;
		};
		gradeStatistics?: {
			passed: number | null;
			failed: number | null;
			count: number | null;
			average: number | null;
		};
		ratingSummary?: {
			average: number | null;
			total: number | null;
		};
		header_image?: ImageType | null;
		faculty?: string | null;
		departments?: string[] | null;
		courseCode?: CourseCode | null;
		messages?: number | null;
	}) {
		this.university = data.university;
		this.name = null;
		this.short_name = null;
		this.uni_identifier = '';
		this.semesters = [];
		this.slug = [];
		this.userCount = {
			all: null,
		};
		this.messages = null;
		this.gradeStatistics = {
			passed: null,
			failed: null,
			count: null,
			average: null,
		};
		this.ratingSummary = {
			average: null,
			total: null,
		};
		this.faculty = null;
		this.type = null;
		this.header_image = null;
		this.departments = null;
		this.courseCode = null;
		this.translatedNames = [];
		Object.assign(this, data);
		if (data.semesters) {
			this.semesters = immutableReverse(
				sortBy(data.semesters, (s) => s.period)
			).map((mis) => new Semester(mis as SemesterResponse));
		}
	}
}

export default Module;
