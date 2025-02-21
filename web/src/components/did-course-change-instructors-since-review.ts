import differenceBy from 'lodash/differenceBy';
import memoize from 'lodash/memoize';
import sortBy from 'lodash/sortBy';
import ms from 'ms';
import {createSelector} from 'reselect';
import {immutableReverse} from '../../../core/functions/immutable-reverse';
import {
	ApiResponse,
	InstructorsResponse,
	SemesterResponse,
} from '../../../core/reducers/api';
import {RatingRequest} from '../../../core/types/ratings';
import Rating from '../models/rating';
import {getPeriodForDate} from './get-period-for-date';

type DidChangePeople = {
	instructors: boolean;
	responsible: boolean;
	lastPeriod: number | null;
};

export const sortSemesters = memoize((semesters: SemesterResponse[]) => {
	return immutableReverse(sortBy(semesters, (s) => s.period));
});

const sortInstructors = memoize((instructors: InstructorsResponse) => {
	return instructors.filter((i) => i.important).map((i) => i.id);
});

const memoizedDifference = memoize(differenceBy);

export const didCourseChangeInstructorsSinceReview = createSelector(
	[
		(course: ApiResponse) => course,
		(course: ApiResponse, review: Rating | RatingRequest) => review,
	],
	(course: ApiResponse, review: Rating | RatingRequest): DidChangePeople => {
		const semestersSortedFromNewestToOldest = sortSemesters(course.semesters);
		if (course.semesters.length === 0) {
			return {instructors: false, responsible: false, lastPeriod: null};
		}

		const reviewPeriod = getPeriodForDate(
			new Date(new Date(review.date as number).getTime() + ms('30d'))
		);
		const newestInstructors = sortInstructors(
			semestersSortedFromNewestToOldest[0].instructors
		);
		const newestResponsible = semestersSortedFromNewestToOldest[0].responsible.map(
			(i) => i.uni_identifier
		);
		for (const semester of semestersSortedFromNewestToOldest) {
			const instructors = semester.instructors
				.filter((i) => i.important)
				.map((i) => i.id);
			const responsible = semester.responsible.map((i) => i.uni_identifier);
			if (reviewPeriod < semester.period) {
				continue;
			}

			const differentInstructors = memoizedDifference(
				instructors,
				newestInstructors
			);
			const differentResponsible = memoizedDifference(
				responsible,
				newestResponsible
			);
			return {
				instructors: differentInstructors.length > 0,
				responsible: differentResponsible.length > 0,
				lastPeriod: semestersSortedFromNewestToOldest[0].period,
			};
		}

		return {
			instructors: false,
			responsible: false,
			lastPeriod: semestersSortedFromNewestToOldest[0].period,
		};
	}
);
