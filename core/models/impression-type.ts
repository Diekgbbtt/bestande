import type {PlatformOSType} from 'react-native';
import {AppLanguage} from './app-language';
import {Institution} from './credit';
import {ImpressionLevel} from './impression-level';

export const TIMETABLE = 'TIMETABLE';
export const CREDIT_DETAIL_VIEW = 'CREDIT_DETAIL_VIEW';
export const PROMOTION = 'PROMOTION';
export const HOMEPAGE = 'HOMEPAGE';
export const SEARCH_VIEW = 'SEARCH_VIEW';
export const MENSA_VIEW = 'MENSA_VIEW';

export type Impression = {
	institution: Institution;
	identifier: string;
	platform: PlatformOSType;
	content: ImpressionType;
	domain?: string;
	content_id?: string;
	level?: ImpressionLevel;
	direction?: string[] | null;
	language: AppLanguage;
	date: number;
};

export type ImpressionType =
	| 'TIMETABLE'
	| 'CREDIT_DETAIL_VIEW'
	| 'PROMOTION'
	| 'HOMEPAGE'
	| 'SEARCH_VIEW'
	| 'MENSA_VIEW'
	| 'FILE';
