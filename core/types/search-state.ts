import {Institution} from '../models/credit';
import {AlgoliaRange} from './algolia-range';

export type SearchState = {
	credits: AlgoliaRange;
	rating: AlgoliaRange;
	uni: Institution | null;
	faculty: string | null;
	department: string | null;
	passRate: AlgoliaRange;
	semesters: string[];
};
