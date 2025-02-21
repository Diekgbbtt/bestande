import {createSelector} from 'reselect';
import {CreditHelpers} from '../../../core/functions/CreditHelpers';
import {getModuleId} from '../../../core/functions/get-module-id';
import {Institution} from '../../../core/models/credit';
import {AppState} from '../../../core/types/app-state';
import {getVisibleBookedModules} from './get-visible-booked-modules';

export const shouldRenderSubscription = createSelector(
	[
		getVisibleBookedModules,
		(state: AppState, uni_identifier: string) => uni_identifier,
		(state: AppState, uni_identifier: string, university: Institution) =>
			university,
	],
	(visibleBookedModules, uni_identifier, university): boolean => {
		return !visibleBookedModules.find(
			(v) =>
				getModuleId(v) === uni_identifier &&
				CreditHelpers.getInstitution(v) === university
		);
	}
);
