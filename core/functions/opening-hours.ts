import addDays from 'date-fns/addDays';
import format from 'date-fns/format';
import isSameDay from 'date-fns/isSameDay';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';
import setSeconds from 'date-fns/setSeconds';
import ms from 'ms';
import OH from 'opening_hours';
import {AppLanguage} from '../models/app-language';
import {GREEN, ORANGE, RED} from '../models/colors';
import rawStrings from '../raw-strings';
import {formatString} from './format-string';
import {getDateFnsLocale} from './get-date-fns-locale';
import {truthy} from './truthy';

const currentStateWhileOpen = (language: AppLanguage, comment: string) => {
	if (!comment) {
		return rawStrings.OPEN[language];
	}

	return formatString(rawStrings.X_OPEN[language], comment);
};

const nextStateWhenOpen = ({
	language,
	open,
	comment,
	string,
	currentComment,
}: {
	language: AppLanguage;
	currentComment: string;
	string: string;
	open: boolean;
	comment: string;
}): string => {
	if (!open) {
		return formatString(rawStrings.CLOSES_AT[language], string);
	}

	return `${rawStrings.FROM_TIME[language]} ${[
		string,
		!currentComment && comment
			? formatString(rawStrings.ONLY_X[language], comment)
			: comment || rawStrings.FOOD_DISTRIBUTION[language],
	]
		.filter(truthy)
		.join(' ')}`;
};

class OpeningHours {
	hours: OH;
	language: AppLanguage;
	date: Date;
	constructor(
		hours: string,
		language: AppLanguage = 'de',
		date: Date = new Date()
	) {
		this.hours = new OH(hours);
		this.date = date;
		this.language = language;
	}

	get open() {
		return this.hours.getState(this.date);
	}

	get comment() {
		return this.hours.getComment(this.date);
	}

	timetable() {
		return this.hours.getOpenIntervals(
			setMinutes(setHours(this.date, 0), 0),
			setSeconds(setMinutes(setHours(this.date, 23), 59), 59)
		);
	}

	label() {
		const nextChangeDate = this.hours.getNextChange(this.date);
		const nextChangeOpen = this.hours.getState(nextChangeDate);
		const nextChangeComment = this.hours.getComment(nextChangeDate);
		const timeUntilNextChange =
			nextChangeDate.getTime() - (this.date as Date).getTime();
		const shouldShowNext =
			timeUntilNextChange < ms('90m') || (!nextChangeComment && this.comment);
		const nextChangeString = isSameDay(this.date, nextChangeDate)
			? format(nextChangeDate, 'HH:mm', {
					locale: getDateFnsLocale(this.language),
			  })
			: isSameDay(addDays(this.date, 1), nextChangeDate)
			? rawStrings.TOMORROW[this.language] +
			  ' ' +
			  rawStrings.OPENS_PREPOSITION[this.language] +
			  ' ' +
			  format(nextChangeDate, 'HH:mm', {
					locale: getDateFnsLocale(this.language),
			  })
			: format(nextChangeDate, 'dd.MM. HH:mm', {
					locale: getDateFnsLocale(this.language),
			  });
		if (this.open) {
			return [
				[
					currentStateWhileOpen(this.language, this.comment),
					shouldShowNext
						? nextStateWhenOpen({
								language: this.language,
								open: nextChangeOpen,
								comment: nextChangeComment,
								string: nextChangeString,
								currentComment: this.comment,
						  })
						: null,
				]
					.filter(truthy)
					.join(', '),
				shouldShowNext ? ORANGE : GREEN,
			];
		}

		if (!this.open) {
			return [
				`${rawStrings.CLOSED[this.language]}, ${
					rawStrings.OPENS[this.language]
				} ${nextChangeString}`,
				RED,
			];
		}
	}
}

export default OpeningHours;
