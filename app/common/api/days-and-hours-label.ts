import differenceInHours from 'date-fns/differenceInHours';
import {daysAndHours} from '../../../core/functions/days-and-hours';
import {AppLanguage} from '../../../core/models/app-language';

export const daysAndHoursLabel = (
	start_date: number,
	end_date: number,
	language: AppLanguage
) => {
	const difference = differenceInHours(end_date, start_date);
	const days = Math.floor(difference / 24);
	const hours = difference - days * 24;
	return daysAndHours(days, hours, language);
};
