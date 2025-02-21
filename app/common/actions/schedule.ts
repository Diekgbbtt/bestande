import {batchActions} from 'redux-batched-actions';
import {
	FetchScheduleAction,
	FETCH_SCHEDULE,
	FETCH_SCHEDULES,
	GetMultipleSchedulesAction,
	ReceiveScheduleAction,
	ReceiveSchedulesAction,
	RECEIVE_SCHEDULES,
} from '../../../core/actions/schedule';
import {Credit} from '../../../core/models/credit';
import {
	receiveSingleExamReturnStatistic,
	ReceiveSingleExamReturnStatistic,
} from '../../../core/reducers/exam-returns';
import {RECEIVE_SCHEDULE} from '../../../web/src/reducers/schedule';
import {ScheduleCache} from '../api/ScheduleCache';

const fetchSchedule = (
	credit: Credit,
	semester: string
): FetchScheduleAction => {
	return {
		type: FETCH_SCHEDULE,
		credit,
		semester,
	};
};

const receiveSchedule = (
	credit: Credit,
	semester: string,
	schedule: any
): ReceiveScheduleAction => {
	return {
		type: RECEIVE_SCHEDULE,
		schedule,
		semester,
		credit,
	};
};

const receiveSchedules = (items: any[][]): ReceiveSchedulesAction => {
	return {
		type: RECEIVE_SCHEDULES,
		items,
	};
};

const fetchSchedules = (
	items: [Credit, string][]
): GetMultipleSchedulesAction => {
	return {
		type: FETCH_SCHEDULES,
		items,
	};
};

export function getSchedule(credit: Credit, semester: string) {
	return async (dispatch: {
		(arg0: FetchScheduleAction): void;
		(arg0: ReceiveScheduleAction): void;
	}) => {
		dispatch(fetchSchedule(credit, semester));
		const response = await ScheduleCache.getWithCache(credit, semester);
		dispatch(receiveSchedule(credit, semester, response.data));
	};
}

export function getSchedules(items: [Credit, string][]) {
	return async (dispatch: {(arg0: any): void; (arg0: any): void}) => {
		dispatch(fetchSchedules(items));
		const responses = await Promise.all(
			items.map(([credit, semester]) => {
				return ScheduleCache.getWithCache(credit, semester);
			})
		);
		const zipped = responses.map((r, i) => {
			return [items[i][0], items[i][1], r.data];
		});
		const examReturnActions: ReceiveSingleExamReturnStatistic[] = [];
		for (const r of responses) {
			if (r.gradesOut) {
				examReturnActions.push(
					receiveSingleExamReturnStatistic(
						r.gradesOut.uni_identifier,
						r.gradesOut.university,
						r.gradesOut
					)
				);
			}
		}

		if (examReturnActions.length) {
			dispatch(batchActions(examReturnActions));
		}

		dispatch(receiveSchedules(zipped));
	};
}
