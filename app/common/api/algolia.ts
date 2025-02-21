import algoliasearch from 'algoliasearch';
import {AlgoliaCreditResult} from '../../../core/types/algolia-range';
import {RoomType} from '../../../core/types/schedule';

const ALGOLIA_APP_ID = '299XCMNA4R';
const ALGOLIA_SEARCH_KEY = '21e9fdae59075788687f4a96f8835360';

const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);

export const moduleIndex = searchClient.initIndex('modules');

export const mostUsersIndex = searchClient.initIndex('most-users');

export const moduleIndexBestRating = searchClient.initIndex('best-rating');

export const mostCreditsRating = searchClient.initIndex('most-credits');

export const bestPassrate = searchClient.initIndex('best-passrate');

export const roomsIndex = searchClient.initIndex('rooms');

export type AlgoliaResponseModules = {
	hits: AlgoliaCreditResult[];
	nbHits: number;
	nbPages: number;
	query: string;
	facets: {
		faculty?: {[key: string]: number};
		departments?: {[key: string]: number};
		semester?: {[key: string]: number};
	};
};

export type AlgoliaResponseRooms = {
	hits: RoomType[];
	nbHits: number;
	nbPages: number;
	query: string;
};
