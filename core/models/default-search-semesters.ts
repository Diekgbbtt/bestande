import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';
import {periodToString} from '../functions/uzh-period';
import {currentPeriod, recommendationPeriod} from './current-period';

export const defaultSearchSemesters = sortBy(
	uniq([currentPeriod, recommendationPeriod]).filter(Boolean),
	(a) => a
).map((p) => periodToString(p));
