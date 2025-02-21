import {Chrono, options} from 'chrono-node';
import moment from 'moment-timezone';
import DEMonthNameLittleEndianParser from './custom-date-parsers/de-month-name-little-endian-parser';
import DETimeExpressionParser from './custom-date-parsers/de-time-expression-parser';
import ENSlashDateFormatParser from './custom-date-parsers/en-slash-date';

export const parseDate = function (string: string) {
	// Hardcode a few ambiguities
	string = string.replace('10-12 a.m.', '10-12');
	const parser = new Chrono({
		parsers: [
			new ENSlashDateFormatParser({}),
			new DEMonthNameLittleEndianParser(),
			new DETimeExpressionParser(),
			...options.de({strict: true}).parsers,
			...options.en_GB({strict: true}).parsers,
		],
		refiners: [
			...options.de({strict: true}).refiners,
			...options.en_GB({strict: true}).refiners,
		],
	});
	const data = [...parser.parse(string.replace(/,/g, ''))];
	const dateWithRanges = data.filter(
		(r) => r.start && r.end && !r.start.impliedValues.day
	);
	if (dateWithRanges.length === 0) {
		return null;
	}

	const dates = dateWithRanges.map((result) => {
		const {start, end} = result;
		const zurich = moment.tz.zone('Europe/Zurich');
		if (!zurich) {
			throw new Error('Did not load timezone');
		}

		start.assign('timezoneOffset', 0 - zurich.utcOffset(start.date()));
		end.assign('timezoneOffset', 0 - zurich.utcOffset(end.date()));

		return {
			start: moment(start.date()).toDate(),
			end: moment(end.date()).toDate(),
		};
	});
	return dates;
};
