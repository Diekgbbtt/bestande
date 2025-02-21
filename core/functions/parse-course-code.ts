import shortname from '@jonny/uzh-course-shortname';
import {Institution} from '../models/credit';
import {CourseCode} from '../models/module';
import {UZH} from '../models/university';
import {courseCodeMap} from './course-code-map';
import {isRomanNumeral} from './is-roman-numeral';
import {sortableIdentifier} from './sortable-identifier';

// Note that BIO680 has a typo
// Note that PHY192 and PHY492 have a type

// List of all modules https://github.com/jonnyburger/bestande/commit/e98b12d959de047ddff1b13f0005b20cd2d567b7/checks?check_suite_id=342339758

export const parseCourseCode = (
	title: string,
	university: Institution
): CourseCode | null => {
	if (university === UZH) {
		// 3 letter codes like BIO 123
		for (const code of Object.keys(courseCodeMap)) {
			const regex = new RegExp(`${code} ([0-9]{3})`);
			const geoMatch = regex.exec(title);
			if (geoMatch) {
				return {
					series: code,
					identifier: geoMatch[1],
					display: true,
					sortable_identfier: sortableIdentifier(geoMatch[1]),
				};
			}
		}

		if (shortname(title) === 'BWL III') {
			return {
				series: 'Betriebswirtschaftslehre',
				identifier: 'III',
				display: false,
				sortable_identfier: sortableIdentifier('3'),
			};
		}

		if (shortname(title) === 'Public Law II & III') {
			return {
				series: 'Public Law',
				identifier: 'II && III',
				display: false,
				sortable_identfier: sortableIdentifier('2'),
			};
		}

		if (shortname(title) === 'Criminal Law II & Criminal Law III') {
			return {
				series: 'Criminal Law',
				identifier: 'II && III',
				display: false,
				sortable_identfier: sortableIdentifier('2'),
			};
		}
	}

	// Roman numerals like Public Law I
	const split =
		university === UZH ? shortname(title).split(' ') : title.split(' ');
	const last = split[split.length - 1];
	if (isRomanNumeral(last)) {
		return {
			series: split.slice(0, split.length - 1).join(' '),
			identifier: last,
			display: false,
			sortable_identfier: sortableIdentifier(last),
		};
	}

	return null;
};
