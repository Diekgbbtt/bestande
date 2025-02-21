import {initialDarkMode} from '../functions/initial-dark-mode';
import {
	Appearance,
	AppearanceSetting,
	AppearanceState,
} from '../types/appearance-state';

const initialState: AppearanceState = {
	systemSetting: initialDarkMode,
	preference: 'auto',
};

export enum AppearanceActions {
	SET_APPEARANCE_MODE = 'SET_APPEARANCE_MODE',
	SET_PREFERRED_APPEARANCE = 'SET_PREFERRED_APPEARANCE',
}

type SetAppearanceMode = {
	type: AppearanceActions.SET_APPEARANCE_MODE;
	mode: Appearance;
};

export const setAppearanceMode = (mode: Appearance): SetAppearanceMode => ({
	type: AppearanceActions.SET_APPEARANCE_MODE,
	mode,
});

type SetPreferredApperance = {
	type: AppearanceActions.SET_PREFERRED_APPEARANCE;
	mode: AppearanceSetting;
};

export const setPreferredAppearance = (
	appearanceSetting: AppearanceSetting
): SetPreferredApperance => {
	return {
		type: AppearanceActions.SET_PREFERRED_APPEARANCE,
		mode: appearanceSetting,
	};
};

export const appearanceReducer = (
	state: AppearanceState = initialState,
	action: SetAppearanceMode | SetPreferredApperance
): AppearanceState => {
	switch (action.type) {
		case AppearanceActions.SET_APPEARANCE_MODE:
			return {
				...state,
				systemSetting: action.mode,
			};
		case AppearanceActions.SET_PREFERRED_APPEARANCE:
			return {
				...state,
				preference: action.mode,
			};
		default:
			return state;
	}
};
