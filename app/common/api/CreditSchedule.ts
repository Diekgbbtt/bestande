import {mapToUniSlug} from '../../../core/functions/uni-slug';
import {Institution} from '../../../core/models/credit';
import {DOMAIN} from '../../../core/models/domain';
import {ScheduleApiResponse} from '../../../core/types/schedule';

export type WrappedScheduleApiResponse = {
	success: true;
	data: ScheduleApiResponse;
};

export const CreditSchedule = async (
	institution: Institution,
	moduleId: string,
	semester: string
): Promise<WrappedScheduleApiResponse> => {
	const body = await fetch(
		`${DOMAIN}/institution/${mapToUniSlug(
			institution
		)}/module/${moduleId}/semester/${semester}/timetable`
	);
	return body.json();
};
