import {createSelector} from 'reselect';
import {Institution} from '../../../core/models/credit';
import {AppState} from '../../../core/types/app-state';

export const hasAnErrorLoadingPreviousMessages = createSelector(
	[
		(state: AppState) => state.chatServer.loadingPreviousMessageError,
		(state: AppState, university: Institution) => university,
		(state: AppState, university: Institution, uni_identifier: string) =>
			uni_identifier,
	],
	(loadingPreviousMessageError, university, uni_identifier): Error | null => {
		if (!loadingPreviousMessageError[university]) {
			return null;
		}

		return loadingPreviousMessageError[university][uni_identifier] || null;
	}
);
