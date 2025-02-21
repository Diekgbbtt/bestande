import {getDefaultLocale} from '../functions/get-default-locale';
import {AppLanguage, LanguageState} from '../models/app-language';

const deviceLang = getDefaultLocale();

const initialState: LanguageState = {
	deviceLanguage: deviceLang,
	selectedLanguage: deviceLang,
};

type SetSelectedLanguage = {
	type: 'SET_SELECTED_LANGUAGE';
	language: AppLanguage;
};

export const setSelectedLanguage = (lang: AppLanguage): SetSelectedLanguage => {
	return {
		type: 'SET_SELECTED_LANGUAGE',
		language: lang,
	};
};

export const language = (
	state: LanguageState = initialState,
	action: SetSelectedLanguage
): LanguageState => {
	switch (action.type) {
		case 'SET_SELECTED_LANGUAGE':
			return {
				...state,
				selectedLanguage: action.language,
			};
		default:
			return state;
	}
};
