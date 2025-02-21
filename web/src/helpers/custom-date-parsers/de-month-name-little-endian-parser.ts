import {ParsedResult, Parser} from 'chrono-node';
import moment from 'moment';

const PATTERN = new RegExp(
	'(\\W|^)' +
		'(?:am\\s*?)?' +
		'(?:(Sonntag|Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|So|Mo|Di|Mi|Do|Fr|Sa)\\s*,?\\s*)?' +
		'(?:den\\s*)?' +
		'([0-9]{1,2})\\.?' +
		'(?:\\s*(?:bis(?:\\s*(?:am|zum))?|\\-|\\–|\\s)\\s*([0-9]{1,2})\\.)?\\s*' +
		'(Jan(?:uar|\\.)?|Feb(?:ruar|\\.)?|Mär(?:z|\\.)?|Maerz|Mrz\\.?|Apr(?:il|\\.)?|Mai|Jun(?:i|\\.)?|Jul(?:i|\\.)?|Aug(?:ust|\\.)?|Sep(?:t|t\\.|tember|\\.)?|Okt(?:ober|\\.)?|Nov(?:ember|\\.)?|Dez(?:ember|\\.)?)' +
		'(?:' +
		',?\\s*([0-9]{1,4}(?![^\\s]\\d))' +
		'(\\s*[vn]\\.?\\s*C(?:hr)?\\.?)?' +
		')?' +
		'(?=\\W|$)',
	'i'
);

const WEEKDAY_GROUP = 2;
const DATE_GROUP = 3;
const DATE_TO_GROUP = 4;
const MONTH_NAME_GROUP = 5;
const YEAR_GROUP = 6;
const YEAR_BE_GROUP = 7;

const MONTH_OFFSET = {
	januar: 1,
	jan: 1,
	'jan.': 1,
	februar: 2,
	feb: 2,
	'feb.': 2,
	märz: 3,
	maerz: 3,
	mär: 3,
	'mär.': 3,
	mrz: 3,
	'mrz.': 3,
	april: 4,
	apr: 4,
	'apr.': 4,
	mai: 5,
	juni: 6,
	jun: 6,
	'jun.': 6,
	juli: 7,
	jul: 7,
	'jul.': 7,
	august: 8,
	aug: 8,
	'aug.': 8,
	september: 9,
	sep: 9,
	'sep.': 9,
	sept: 9,
	'sept.': 9,
	oktober: 10,
	okt: 10,
	'okt.': 10,
	november: 11,
	nov: 11,
	'nov.': 11,
	dezember: 12,
	dez: 12,
	'dez.': 12,
};

const WEEKDAY_OFFSET = {
	sonntag: 0,
	so: 0,
	montag: 1,
	mo: 1,
	dienstag: 2,
	di: 2,
	mittwoch: 3,
	mi: 3,
	donnerstag: 4,
	do: 4,
	freitag: 5,
	fr: 5,
	samstag: 6,
	sa: 6,
};

export default function DEMonthNameLittleEndianParser() {
	// @ts-expect-error
	Parser.apply(this, arguments); // eslint-disable-line

	// @ts-expect-error

	this.pattern = function () {
		return PATTERN;
	};

	// @ts-expect-error

	this.extract = function (text, ref, match) {
		const result = new ParsedResult({
			text: match[0].substr(match[1].length, match[0].length - match[1].length),
			index: match.index + match[1].length,
			ref,
		});

		let month = match[MONTH_NAME_GROUP];
		month = MONTH_OFFSET[month.toLowerCase()];

		let day = match[DATE_GROUP];
		day = parseInt(day, 10);

		let year: number | null | string = null;
		if (match[YEAR_GROUP]) {
			year = match[YEAR_GROUP];
			year = parseInt(String(year), 10);

			if (match[YEAR_BE_GROUP]) {
				if (/v/i.test(match[YEAR_BE_GROUP])) {
					// v.Chr.
					year = -year;
				}
			} else if (year < 100) {
				year += 2000;
			}
		}

		if (year) {
			result.start.assign('day', day);
			result.start.assign('month', month);
			result.start.assign('year', year);
		} else {
			// Find the most appropriated year
			let refMoment = moment(ref);
			refMoment.month(month - 1);
			refMoment.date(day);
			refMoment.year(moment(ref).year());

			const nextYear = refMoment.clone().add(1, 'y');
			const lastYear = refMoment.clone().add(-1, 'y');
			if (
				Math.abs(nextYear.diff(moment(ref))) <
				Math.abs(refMoment.diff(moment(ref)))
			) {
				refMoment = nextYear;
			} else if (
				Math.abs(lastYear.diff(moment(ref))) <
				Math.abs(refMoment.diff(moment(ref)))
			) {
				refMoment = lastYear;
			}

			result.start.assign('day', day);
			result.start.assign('month', month);
			result.start.imply('year', refMoment.year());
		}

		// Weekday component
		if (match[WEEKDAY_GROUP]) {
			let weekday = match[WEEKDAY_GROUP];
			weekday = WEEKDAY_OFFSET[weekday.toLowerCase()];
			result.start.assign('weekday', weekday);
		}

		// Text can be 'range' value. Such as '12 - 13 January 2012'
		if (match[DATE_TO_GROUP]) {
			result.end = result.start.clone();
			result.end.assign('day', parseInt(match[DATE_TO_GROUP], 10));
		}

		result.tags.DEMonthNameLittleEndianParser = true;
		return result;
	};
}
