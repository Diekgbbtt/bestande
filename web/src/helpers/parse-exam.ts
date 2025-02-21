import {Institution} from '../../../core/models/credit';
import {EXAM, REPETITION_EXAM} from '../../../core/models/module-type';
import {EventSerieType, EventType} from '../../../core/types/schedule';
import {parseDate} from './parse-date';

export const parseExam = function ({
	uni_identifier,
	string,
	university,
	period,
}: {
	uni_identifier: string;
	string: string;
	university: Institution;
	period: number;
}) {
	const reexam = ['wiederholung', 're-exam', 'reexam'].some((s) =>
		string.toLowerCase().includes(s)
	);
	const date = parseDate(string);
	if (!date) {
		return null;
	}

	const eventSerie: EventSerieType = {
		category: reexam ? REPETITION_EXAM : EXAM,
		time_label: null,
		comments: string,
		people: [],
		id: `${uni_identifier}-exam`,
		smart: true,
	};
	const events = date.map((d, i) => {
		const event: EventType = {
			start_date: d.start,
			end_date: d.end,
			university,
			event_serie_id: eventSerie.id,
			id: String(i + 1),
			period,
			smart: true,
			rooms: [],
			comments: string,
		};
		return event;
	});
	return {
		events,
		eventSerie,
	};
};
