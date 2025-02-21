import * as Localize from 'react-native-localize';
import {AppLanguage} from '../models/app-language';

const parseLocale = (locales: string[]): AppLanguage => {
	if (locales[0].startsWith('de')) {
		return 'de';
	}

	if (locales[0].startsWith('en')) {
		return 'en';
	}

	return 'en';
};

export const getDefaultLocale = () => {
	return parseLocale(Localize.getLocales().map((l) => l.languageCode));
};
