import {TranslatedName} from './module';

export type UntypedGrade = null | string | number | undefined;
export type UntypedCreditAmount = null | string | number;

export type CreditStatus =
	| 'PASSED'
	| 'DESELECTED'
	| 'FAILED'
	| 'ADDED'
	| 'BOOKED'
	| 'CONTINUE'
	| 'UNKNOWN_STATUS'
	| 'UNKNOWN'
	| 'NOT_BOOKED';

export type CreditConfig = {
	status: CreditStatus;
	label: string;
	color: string;
	icon: NodeRequire | null;
};

export type PeriodHuman =
	| 'FS09'
	| 'HS09'
	| 'FS10'
	| 'HS10'
	| 'FS11'
	| 'HS11'
	| 'FS12'
	| 'HS12'
	| 'FS13'
	| 'HS13'
	| 'FS14'
	| 'HS14'
	| 'FS15'
	| 'HS15'
	| 'FS16'
	| 'HS16'
	| 'FS17'
	| 'HS17'
	| 'FS18'
	| 'HS18'
	| 'FS19'
	| 'HS19'
	| 'FS20'
	| 'HS20'
	| 'FS21'
	| 'HS21'
	| 'FS22'
	| 'HS22'
	| 'FS23'
	| 'HS23'
	| 'FS24'
	| 'HS24'
	| 'FS25';

export type Institution = 'UZH' | 'ETH';

export type CustomModule = {
	_id?: string;
	uni_identifier: string;
	university: Institution;
	name: string;
	short_name: string;
	period: number;
	credits_worth: UntypedCreditAmount;
};

type ModuleCollectionItemBase = {
	uni_identifier: string;
	university: Institution;
	period: number;
	grade?: UntypedGrade;
	created: number;
};

export type ModuleCollectionItem = ModuleCollectionItemBase & {
	type: 'authenticated' | 'anonymous';
	user: string;
	loggedOut?: boolean;
};

type ModuleCollectionItemResponse = ModuleCollectionItemBase & {
	short_name: string;
	name: string;
	credits: number;
};

export type GetCoursesResponse = {
	courses: ModuleCollectionItemResponse[];
	nonce: number;
};

export type Credit = {
	_id?: string;
	name: string;
	short_name: string;
	credits_worth: UntypedCreditAmount;
	credits_received: UntypedCreditAmount;
	status: CreditStatus;
	grade: UntypedGrade;
	institution?: Institution;
	university?: Institution;

	uni_identifier?: string | null;
	link?: string | null;
	period?: number;
	semester?: string | null;
	key?: string;
	translatedNames?: TranslatedName[];
	// TODO: Add Semester type
	semesters?: any[];
	module?: null | string;
	type?: undefined;
	custom?: boolean;
};

export type ModuleCollection = CustomModule[];
