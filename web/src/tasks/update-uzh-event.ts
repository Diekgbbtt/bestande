import {EventType} from '../../../core/types/schedule';
import {Job} from '../../../core/types/types';
import {eventCollection, roomCollection} from '../db/collections';
import {fetchEvents} from './fetch-uzh';
import {makeEventFromJson} from './uzh-converter';

const updateUzhEvent = async (
	job: Job<{
		Objid: string;
		PiqYear: number;
		PiqSession: string;
	}>
) => {
	const {Objid, PiqYear, PiqSession} = job.attrs.data;
	const response = await fetchEvents(Objid, PiqYear, PiqSession);
	const events = response.Schedule.results;
	const mappedEvents: EventType[] = await Promise.all<EventType>(
		events.map((e) => makeEventFromJson(e))
	);

	for (const e of mappedEvents) {
		await eventCollection().deleteOne({
			id: e.id,
			event_serie_id: e.event_serie_id,
			university: e.university,
			period: e.period,
		});
		await eventCollection().updateOne(
			{
				id: e.id,
				event_serie_id: e.event_serie_id,
				university: e.university,
			},
			{
				$set: e,
			},
			{upsert: true}
		);
		for (const room of e.rooms) {
			await roomCollection().updateOne(
				{
					id: room.id,
					university: room.university,
				},
				{
					$set: room,
				},
				{
					upsert: true,
				}
			);
		}
	}
};

export default updateUzhEvent;
