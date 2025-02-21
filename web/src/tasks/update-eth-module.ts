import flatten from 'lodash/flatten';
import uniq from 'lodash/uniq';
import pAll from 'p-all';
import xns from 'xns';
import {ETH} from '../../../core/models/university';
import {Job} from '../../../core/types/types';
import {addSemester} from '../db/add-semester';
import {
	eventCollection,
	moduleCacheCollection,
	peopleCollection,
	roomCollection,
} from '../db/collections';
import {connectToMongo} from '../db/modern';
import {
	getEvents,
	makeModuleFromHtml,
	makePersonFromEthHtml,
	makeRoomFromHtml,
	makeSemesterFromHtml,
} from './eth-converter';
import {fetchModule, fetchPerson, fetchRoom} from './fetch-eth';

const updateEthModule = xns(
	async (
		job: Job<{
			uni_identifier: string;
			semester: string;
		}> = {
			attrs: {
				data: {
					semester: '2020W',
					uni_identifier: '139556',
				},
			},
		}
	) => {
		await connectToMongo();
		const {uni_identifier, semester} = job.attrs.data;
		const response: string = await fetchModule(uni_identifier, semester, true);
		const mod = makeModuleFromHtml(response);
		const sem = await makeSemesterFromHtml(semester, response);
		const responsible = await Promise.all(
			(sem.responsible as string[]).map(async (r) => {
				const person = await fetchPerson(r, semester, true);
				return makePersonFromEthHtml(r, person.toString());
			})
		);
		await pAll(
			responsible.map((r) => () =>
				peopleCollection().updateOne(
					{
						uni_identifier: r.uni_identifier,
						university: r.university,
					},
					{
						$set: r,
					},
					{upsert: true}
				)
			),
			{
				concurrency: 4,
			}
		);
		const events = flatten(await getEvents(semester, response));
		await pAll(
			events.map((e) => () =>
				eventCollection().updateOne(
					{
						university: e.university,
						event_serie_id: e.event_serie_id,
						id: e.id,
					},
					{
						$set: e,
					},
					{upsert: true}
				)
			),
			{concurrency: 4}
		);
		const roomIds = flatten(
			flatten(events).map((e) => e.rooms.map((r) => r.id))
		);
		const roomHtml = await Promise.all(uniq(roomIds).map(fetchRoom));
		const roomObjs = await Promise.all(
			roomHtml.map((_roomHtml, i) => makeRoomFromHtml(roomIds[i], _roomHtml))
		);
		await pAll(
			roomObjs.map((r) => () => {
				return roomCollection().updateOne(
					{
						university: r.university,
						id: r.id,
					},
					{
						$set: r,
					},
					{
						upsert: true,
					}
				);
			}),
			{
				concurrency: 4,
			}
		);
		await moduleCacheCollection().updateOne(
			{
				uni_identifier,
				semester,
				university: ETH,
			},
			{
				$set: {
					uni_identifier,
					semester,
					university: ETH,
					module: sem,
				},
			},
			{upsert: true}
		);
		return addSemester(mod, sem);
	}
);

export default updateEthModule;
