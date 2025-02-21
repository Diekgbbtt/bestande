import {AppearanceState} from '../../../core/types/appearance-state';

export const appearance = (): AppearanceState => {
	return {
		preference: 'explicit-light',
		systemSetting: 'light',
	};
};
