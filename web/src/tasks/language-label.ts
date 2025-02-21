import {AppLanguageDeprecated} from '../../../core/models/app-language';

export const languageLabel = (language: AppLanguageDeprecated) => {
	switch (language) {
		case 'de':
			return 'Deutsch';
		case 'en':
			return 'Englisch';
		case 'it':
			return 'Italienisch';
		default:
			return null;
	}
};
