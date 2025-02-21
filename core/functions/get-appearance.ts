import {createSelector} from 'reselect';
import {Appearance, AppearanceState} from '../types/appearance-state';

export const getAppearance = createSelector(
	[
		(state: AppearanceState) => state.preference,
		(state: AppearanceState) => state.systemSetting,
	],
	(preference, systemSetting): Appearance => {
		if (preference === 'explicit-dark') {
			return 'dark';
		}

		if (preference === 'explicit-light') {
			return 'light';
		}

		return systemSetting;
	}
);
