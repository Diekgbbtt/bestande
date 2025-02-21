import {getSchedule} from '../../../core/functions/get-next-event-from-credit';
import {getUniqueIdentifier} from '../../../core/functions/get-unique-identifier';
import {SeriesConfig} from '../../../core/functions/SeriesConfig';
import {Credit} from '../../../core/models/credit';
import {AppState} from '../../../core/types/app-state';

export const getSeriesConfig = (
	state: AppState,
	credit: Credit,
	semester: string
) => {
	const schedule = getSchedule(state.schedule, credit, semester);
	if (!schedule.schedule) {
		return {};
	}

	const config = state.seriesConfig[getUniqueIdentifier(credit, true)];
	if (!config) {
		return SeriesConfig.getDefault(schedule.schedule);
	}

	return config;
};
