import memoize from 'lodash/memoize';
import {Institution} from '../models/credit';
import {mapToUniSlug} from './uni-slug';

export type TabIndex =
	| 'statistics'
	| 'related'
	| 'info'
	| 'timetable'
	| 'ratings'
	| 'files'
	| 'books'
	| 'chat'
	| 'recommendedbooks';

export const getChatRoomIdentifier = memoize(
	(uni_identifier: string, university: Institution | null): string => {
		if (uni_identifier === 'all') {
			return 'all';
		}

		return (
			(university ? mapToUniSlug(university as Institution) : 'custom') +
			uni_identifier
		);
	},
	(uni_identifier, university) => uni_identifier + university
);
