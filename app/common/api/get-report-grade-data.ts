import last from 'lodash/last';
import sortBy from 'lodash/sortBy';
import {mapToUniSlug} from '../../../core/functions/uni-slug';
import {periodToString} from '../../../core/functions/uzh-period';
import {Institution} from '../../../core/models/credit';
import {DOMAIN} from '../../../core/models/domain';
import {ApiResponseState} from '../../../core/types/api-reducer-state';
import {EventType, ScheduleApiResponse} from '../../../core/types/schedule';
import {ExpandedExamReturnStatistic} from '../../../core/types/types';

export type GradeReportReturnType =
	| {type: 'semester_unavailable'}
	| {type: 'grades_already_entered'; statistic: ExpandedExamReturnStatistic}
	| {type: 'valid'; lastExamDate: number};

export const getReportGradeData = async ({
	period,
	institution,
	moduleId,
	apiResponse,
}: {
	period: number;
	institution: Institution;
	moduleId: string;
	apiResponse: ApiResponseState;
}): Promise<GradeReportReturnType> => {
	const semestersAvailable = apiResponse.details?.semesters.map(
		(s) => s.period
	);
	if (!semestersAvailable?.includes(period)) {
		return {type: 'semester_unavailable'};
	}

	const response = await fetch(
		`${DOMAIN}/institution/${mapToUniSlug(
			institution
		)}/module/${moduleId}/semester/${periodToString(period)}/timetable`
	);
	const rawJson = await response.json();
	const json = rawJson.data as ScheduleApiResponse;
	if (json.gradesOut) {
		return {type: 'grades_already_entered', statistic: json.gradesOut};
	}

	const examSeries = json.data
		.filter((d) => d.category === 'EXAM')
		.map((d) => d.events)
		.flat(1);
	if (examSeries.length > 0) {
		const lastExam = last(sortBy(examSeries, (e) => e.end_date)) as EventType;
		return {
			type: 'valid',
			lastExamDate:
				new Date(lastExam.end_date as string).getTime() || Date.now(),
		};
	}

	const allEvents = json.data.map((d) => d.events).flat(1);
	if (allEvents.length === 0) {
		return {type: 'valid', lastExamDate: Date.now()};
	}

	const lastEvent = last(sortBy(allEvents, (e) => e.end_date)) as EventType;
	return {
		type: 'valid',
		lastExamDate:
			new Date(lastEvent.end_date as string).getTime() || Date.now(),
	};
};
