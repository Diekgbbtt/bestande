import algoliasearch, {SearchClient, SearchIndex} from 'algoliasearch';

let algoliaClient: SearchClient | null = null;
let algoliaIndex: SearchIndex | null = null;

const ALGOLIA_APP_ID = '299XCMNA4R';
const ALGOLIA_SEARCH_KEY = '21e9fdae59075788687f4a96f8835360';

algoliaClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);
algoliaIndex = algoliaClient.initIndex('modules');

export const suggestAlgolia = async ({
	query,
	size = 7,
	offset = 0,
	institution,
}): Promise<{
	hits: any[];
	nbHits: number;
}> => {
	if (!algoliaIndex) {
		throw new Error('expected algolia index');
	}

	const {hits, nbHits} = await algoliaIndex.search(query, {
		facetFilters: [`university:${institution}`],
		attributesToHighlight: [],
		length: size,
		offset,
	});
	return {
		hits,
		nbHits,
	};
};
