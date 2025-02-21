import max from 'lodash/max';
import sortBy from 'lodash/sortBy';
import Module from '../models/module';

export const sortModulesByRelevance = (input: Module[]) => {
	// Show newest semester first, then sort by popularity
	const sortedByUserCount = sortBy(input, (m) => 0 - (m?.userCount?.all ?? 0));
	return sortBy(
		sortedByUserCount,
		(m) => 0 - (max(m.semesters.map((sm) => sm.period)) || 0)
	);
};
