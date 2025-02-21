import groupBy from 'lodash/groupBy';
import {Institution} from '../../../core/models/credit';
import {ETH, UZH} from '../../../core/models/university';
import {SearchFacet} from '../components/SearchDepartmentFacet';

export const calculateSearchFacets = (
	institution: Institution,
	queryFacets: SearchFacet[]
) => {
	const filtered = queryFacets.filter((facet) => {
		if (facet.type === 'departments' && institution !== ETH) {
			return false;
		}

		if (facet.type === 'faculty' && institution !== UZH) {
			return false;
		}

		return (
			facet.type !== 'credits' &&
			facet.type !== 'ratings' &&
			facet.type !== 'passrate'
		);
	});
	const groupedByType = groupBy(filtered, (f) => f.type);
	const byType = Object.values(groupedByType);
	return byType.map((type) => {
		return type.map((facet) => `${facet.type}:${facet.name}`);
	});
};
