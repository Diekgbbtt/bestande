import values from 'lodash/values';
import {mapToUniSlug} from '../../../core/functions/uni-slug';
import * as institutes from '../../../core/models/university';

export const instituteRegex = (): string => {
	return `(${values(institutes).map(mapToUniSlug).join('|')})`;
};
