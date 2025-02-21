import {ImageType} from '../types/image';
import {Institution} from './credit';
import {ImpressionPlatform} from './platform';
import {PromotionType} from './promotion-type';
import {TimeDisplay} from './time-display-type';
import {UZHFaculty} from './uzh-faculties';

type TranslatedVersion = {
	promoter?: string;
	promoter_link?: string;
	name?: string;
	image?: ImageType | null;
	description?: string;
};

export type PromotionResponse = {
	_id?: string;
	type: PromotionType;
	promoter: string;
	promoter_link: string;
	name: string;
	live: boolean;
	image: ImageType | null;
	logo?: {
		cdn_identifier: string;
		height: number;
		width: number;
	};
	description: string;
	start_date: number;
	end_date: number;
	time_display: TimeDisplay;
	creator: string | null;
	open_in_browser: boolean;
	top_position: boolean;
	cta_text?: string;
	exclusive: boolean;
	statistics?: {
		view: number;
		click: number;
		cta: number;
	};
	location: {
		latitude: number;
		longitude: number;
		address: string;
	} | null;
	faculty?: UZHFaculty[];
	platform?: ImpressionPlatform;
	price?: number;
	password?: string;
	institution?: Institution;
	scheduled?: boolean;
	scheduled_start?: number;
	scheduled_end?: number;
	translations?: {[key: string]: TranslatedVersion};
	child_of?: string;
	alternative_of?: string;
	retired?: boolean;
};
