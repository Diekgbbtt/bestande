import groupBy from 'lodash/groupBy';
import memoize from 'lodash/memoize';
import sortBy from 'lodash/sortBy';
import uniqBy from 'lodash/uniqBy';
import {Credit, CustomModule, Institution} from '../models/credit';
import {UZH} from '../models/university';
import {ApiResponse} from '../reducers/api';
import {ScheduleReducerState} from '../reducers/ScheduleReducerState';
import {SeriesConfigType} from '../types/serie-config';
import {cannotNavigate} from './cannot-navigate';
import {getNextEventFromCredit} from './get-next-event-from-credit';
import {getUniqueIdentifier} from './get-unique-identifier';
import {immutableReverse} from './immutable-reverse';
import {humanToPeriod, periodToString} from './uzh-period';

const uzhSemesters = require('@jonny/uzh-semesters');

export type ViewGroup = {
	semester: string;
	key: string;
	data: Credit[];
};

export class CreditHelpers {
	static getShortName(credit: Credit): string {
		if (credit.short_name) {
			return this.getCategoryShortName(credit.short_name);
		}

		return credit.name;
	}

	static getCategoryShortName(category: string): string {
		return category.replace(/\n/g, ' ');
	}

	static getPeriod(credit: Credit | CustomModule): number | null {
		return humanToPeriod(CreditHelpers.getSemester(credit));
	}

	static getSemester = memoize((credit: Credit | CustomModule | ApiResponse):
		| string
		| null => {
		if ((credit as any).period) {
			return periodToString((credit as Credit | CustomModule).period as number);
		}

		credit = credit as Credit;
		if (credit.semester) {
			if (Array.isArray(credit.semester)) {
				return credit.semester[0];
			}

			return credit.semester;
		}

		if (credit.semesters) {
			return periodToString(
				immutableReverse(sortBy(credit.semesters.map((s) => s.period)))[0]
			);
		}

		if (!credit.link || typeof credit.link !== 'string') {
			return null;
		}

		const match = /\/details\/([0-9]{4})\/(003|004)\/(SM|CW)\/([0-9]+)/.exec(
			credit.link
		);
		if (match) {
			const [, year, semester] = match;
			const semestercode = semester === '003' ? 'HS' : 'FS';
			const yearAsNumber =
				semestercode === 'HS'
					? parseInt(year.substr(2, 2), 10)
					: parseInt(year.substr(2, 2), 10) + 1;
			return semestercode + yearAsNumber;
		}

		const lastMatch = /.ch\/((HS|FS)[0-9]+)/.exec(credit.link);
		if (!lastMatch) {
			throw new Error('Could not match semester');
		}

		return lastMatch[1];
	});

	static getInstitution = memoize(
		(credit: Credit | CustomModule): Institution => {
			if (credit.university) {
				return credit.university;
			}

			if ((credit as any).institution) {
				return (credit as Credit).institution as Institution;
			}

			return UZH;
		}
	);

	static hasSemester(credit: Credit) {
		if (credit.period) {
			return credit.period;
		}

		return credit?.link?.match(/.ch\/((HS|FS)[0-9]+)/);
	}

	static groupBySemester({
		credits,
		schedule,
		seriesConfig,
	}: {
		credits: Credit[];
		schedule: ScheduleReducerState;
		seriesConfig: SeriesConfigType;
	}): ViewGroup[] {
		const creditsGrouped: {[key: string]: Credit[]} = groupBy(
			credits,
			(credit: Credit) => {
				if (credit.period || credit.semester) {
					return CreditHelpers.getSemester(credit);
				}

				if (cannotNavigate(credit)) {
					return 'Andere'; // TRANSLATE and avoid crash
				}

				return CreditHelpers.getSemester(credit);
			}
		);
		const creditKeys = Object.keys(creditsGrouped);
		const creditsWithLastBlockType: ViewGroup[] = creditKeys.map((semester) => {
			const data = creditsGrouped[semester];
			return {
				semester,
				data: sortBy(
					uniqBy(
						data.map(
							(credit: Credit): Credit => {
								return {
									...credit,
									key: semester + getUniqueIdentifier(credit),
								};
							}
						),
						(c) => c.key
					),
					(credit) => {
						const nextEvent = getNextEventFromCredit(
							schedule,
							seriesConfig,
							credit,
							CreditHelpers.getSemester(credit) as string
						);
						if (!nextEvent) {
							return Infinity;
						}

						return new Date(nextEvent.event.start_date as Date).getTime();
					}
				),

				key: semester,
			};
		});

		return immutableReverse(
			sortBy(creditsWithLastBlockType, (row) =>
				uzhSemesters.all.indexOf(row.semester)
			)
		);
	}
}
