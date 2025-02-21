import deLocale from 'date-fns/locale/de';
import {AppLanguage} from '../models/app-language';

export const getDateFnsLocale = (language: AppLanguage) => {
	if (language === 'en') {
		return undefined;
	}

	return deLocale;
};
