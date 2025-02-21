import xns from 'xns';
import Semester from '../core/models/semester';
import {EventSerieType} from '../core/types/schedule';
import {eventCollection, moduleCollection} from '../web/src/db/collections';

let i = 0;
const period = 20201;

xns(async () => {
	const events = await eventCollection().find({smart: true, period}).toArray();
	for (const event of events) {
		const uni_identifier = event.event_serie_id;
		const mod = await moduleCollection().findOne({
			uni_identifier: String(uni_identifier),
		});
		if (!mod) {
			throw new Error('expected to find module');
		}

		const semester = mod.semesters.find((m) => m.period === period) as Semester;
		const eventSeries = (semester.event_series as EventSerieType[]).find(
			(es) => !es.smart
		);
		if (eventSeries) {
			console.log(eventSeries);
		} else {
			console.log(++i, 'unique', mod.uni_identifier);
		}
	}

	return true;
});
