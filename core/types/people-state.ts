import {ErrorWithStatusCode} from '../functions/api-request';
import {Institution} from '../models/credit';
import Module from '../models/module';
import {ImageType} from './image';

export type PersonRaw = {
	id: string;
	important: boolean;
};

export type ExpandedPerson = {
	title?: string;
	first_name?: string;
	last_name?: string;
	name?: string;
	university: Institution;
	uni_identifier?: string | null;
	image?: ImageType | null;
	header_image?: ImageType | null;
	responsible?: Module[];
	teaching?: Module[];
	titles?: string;
};

export type SinglePersonState = {
	loading: boolean;
	data: ExpandedPerson | null;
	error: null | ErrorWithStatusCode;
};

export type PeopleState = {
	[key: string]: SinglePersonState;
};
