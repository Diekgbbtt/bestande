import {createSelector} from 'reselect';
import {cannotNavigate} from '../../../core/functions/cannot-navigate';
import {getVisibleCredits} from '../../../core/functions/Credits';

export const navigateableCredits = createSelector(
	[getVisibleCredits],
	(visibleCredits) => {
		return visibleCredits.filter((c) => !cannotNavigate(c));
	}
);
