import uzhSemesters from '@jonny/uzh-semesters';
import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';
import {createSelector} from 'reselect';
import {CreditHelpers} from '../../../core/functions/CreditHelpers';
import {immutableReverse} from '../../../core/functions/immutable-reverse';
import {navigateableCredits} from '../selectors/credits';

export const getAvailableSemesters = createSelector(
	[navigateableCredits],
	(credits) => {
		const semesters = credits.map((c) => CreditHelpers.getSemester(c));
		return immutableReverse(
			sortBy(uniq(semesters), (s) => {
				if (!s) {
					return null;
				}

				return uzhSemesters.all.indexOf(s);
			})
		).filter((x): x is string => x !== null);
	}
);
