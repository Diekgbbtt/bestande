import {AppLanguage} from '../models/app-language';
import rawStrings from '../raw-strings';

export const daysAndHours = (
	days: number,
	hours: number,
	language: AppLanguage
) => {
	return [
		days > 0 ? days : null,
		days === 1 ? rawStrings.DAY[language] : null,
		days > 1 ? rawStrings.DAYS[language] : null,
		hours > 0 ? hours : null,
		hours === 1 ? rawStrings.HOUR[language] : null,
		hours > 1 ? rawStrings.HOURS[language] : null,
	]
		.filter(Boolean)
		.join(' ');
};
