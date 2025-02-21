import {AppLanguage} from '../models/app-language';
import rawStrings from '../raw-strings';

export const humanWeekday = (day: number, language: AppLanguage) => {
	return [
		rawStrings.MONDAY[language],
		rawStrings.TUESDAY[language],
		rawStrings.WEDNESDAY[language],
		rawStrings.THURSDAY[language],
		rawStrings.FRIDAY[language],
		rawStrings.SATURDAY[language],
		rawStrings.SUNDAY[language],
	][day];
};
