import addDays from 'date-fns/addDays';
import addWeeks from 'date-fns/addWeeks';
import differenceInDays from 'date-fns/differenceInDays';
import endOfDay from 'date-fns/endOfDay';
import format from 'date-fns/format';
import getISOWeek from 'date-fns/getISOWeek';
import isSameDay from 'date-fns/isSameDay';
import startOfDay from 'date-fns/startOfDay';
import startOfISOWeek from 'date-fns/startOfISOWeek';
import capitalize from 'lodash/capitalize';
import groupBy from 'lodash/groupBy';
import memoize from 'lodash/memoize';
import {AppLanguage} from '../models/app-language';
import {PromotionResponse} from '../models/promotion';
import rawStrings from '../raw-strings';
import {EventType} from '../types/schedule';
import {getDateFnsLocale} from './get-date-fns-locale';
import {humanWeekday} from './human-weekday';

export class EventHelpers {
	static getTime = memoize((_date: string | number | Date) => {
		const date = new Date(_date);
		return (
			EventHelpers.addPadding(date.getHours()) +
			':' +
			EventHelpers.addPadding(date.getMinutes())
		);
	});

	static getTimeDescription = memoize(
		(
			_start_date: string | Date,
			_end_date: string | Date,
			language: AppLanguage
		) => {
			const startdate = new Date(_start_date);
			const enddate = new Date(_end_date);
			const now = new Date();
			if (startdate < now && enddate > now) {
				return `${rawStrings.UNTIL[language]} ${EventHelpers.getTime(
					_end_date
				)}`;
			}

			return EventHelpers.getTime(_start_date);
		},
		(start, end, language) => start + String(end) + language
	);

	static isInFuture = memoize((_date: string | Date | null) => {
		if (_date === null) {
			return false;
		}

		const date = new Date(_date);
		return date.getTime() > Date.now();
	});

	static addPadding = memoize((minutes: number): string => {
		if (minutes < 10) {
			return '0' + minutes;
		}

		return String(minutes);
	});

	static relativeDay = memoize(
		(
			_start_date: string | Date | null,
			_end_date: string | Date | null,
			language: AppLanguage
		): string => {
			if (_start_date === null || _end_date === null) {
				return '';
			}

			const startdate = new Date(_start_date);
			const enddate = new Date(_end_date);
			const days =
				0 - differenceInDays(startOfDay(new Date()), startOfDay(startdate));
			if (days === 0) {
				if (
					!EventHelpers.isInFuture(_start_date) &&
					EventHelpers.isInFuture(enddate)
				) {
					return capitalize(rawStrings.NOW[language]);
				}

				return capitalize(rawStrings.TODAY[language]);
			}

			if (days === 1) {
				return capitalize(rawStrings.TOMORROW[language]);
			}

			if (days > 0 && days < 7) {
				return humanWeekday(startdate.getDay() - 1, language);
			}

			return EventHelpers.getDate(new Date(_start_date), language);
		},
		(start, end, language) => String(start) + String(end) + language
	);

	static getShortenedHumanWeekday = memoize(
		(day: number, language: AppLanguage) => {
			return humanWeekday(day, language).substr(0, 2).toUpperCase();
		},
		(day, language) => day + language
	);

	static getWeek = memoize((date: Date | number) => {
		return `${getISOWeek(new Date(date))}-${new Date(date).getFullYear()}`;
	});

	static eventIsInDayRange = memoize(
		(event: EventType | PromotionResponse, dayRange: (Date | number)[]) => {
			if (event.start_date === null) {
				return false;
			}

			const startRange = startOfDay(new Date(dayRange[0]));
			const endRange = endOfDay(new Date(dayRange[1]));

			const dateFnsReturn =
				new Date(event.start_date).getTime() >= startRange.getTime() &&
				new Date(event.start_date).getTime() < endRange.getTime();
			return dateFnsReturn;
		},
		(e: EventType | PromotionResponse, dayRange: (Date | number)[]) =>
			e.start_date + String(dayRange[0]) + String(dayRange[1])
	);

	static getDayRange = memoize((week: Date | number) => {
		const now = new Date();
		let first = EventHelpers.nthDayOfTheWeek(week, 1);
		// If same week, don't show dates that are passed
		if (EventHelpers.getWeek(week) === EventHelpers.getWeek(now)) {
			while (!isSameDay(first, now)) {
				first = addDays(first, 1);
			}
		}

		// If week previous one from now, show more
		let last = addDays(first, 6);
		if (
			EventHelpers.getWeek(week) === EventHelpers.getWeek(addWeeks(now, -1))
		) {
			last = addDays(now, -1);
		}

		return [first, last];
	});

	static groupByDay = (events: EventType[]) => {
		return groupBy(events, (event) => {
			return startOfDay(event.start_date ? new Date(event.start_date) : 0);
		});
	};

	static getDate = memoize(
		(date: Date, language: AppLanguage) => {
			const dateFnsOutput = format(date, 'd. MMM', {
				locale: getDateFnsLocale(language),
			});

			return dateFnsOutput;
		},
		(date, lang) => String(date) + lang
	);

	static getFullDate = memoize(
		(date: Date | number, language: AppLanguage) => {
			return format(date, 'd. MMMM yyyy', {
				locale: getDateFnsLocale(language),
			});
		},
		(date, lang) => String(date) + lang
	);

	static firstDayOfTheWeek = memoize((date: Date | number) => {
		return startOfISOWeek(date);
	});

	static nthDayOfTheWeek = memoize(
		(date: Date | number, n: number) => {
			return addDays(EventHelpers.firstDayOfTheWeek(date), n - 1);
		},
		(date, n) => String(date) + n
	);

	static hoursAfterTheDate = memoize((date: Date | string) => {
		const dateFnsOutput =
			new Date(date).getHours() + new Date(date).getMinutes() / 60;
		return dateFnsOutput;
	});
}
