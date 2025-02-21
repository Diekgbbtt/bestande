import {createSelector} from 'reselect';
import {getVisibleCredits} from '../../../core/functions/Credits';
import {Credit} from '../../../core/models/credit';
import {AppState} from '../../../core/types/app-state';
import {isCreditBooked} from './is-credit-booked';

export const getVisibleBookedModules = createSelector(
	[(state: AppState) => getVisibleCredits(state)],
	(visibleCredits: Credit[]): Credit[] => {
		return visibleCredits.filter((c) => isCreditBooked(c));
	}
);
