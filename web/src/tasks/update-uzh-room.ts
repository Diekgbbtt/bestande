import {UZH} from '../../../core/models/university';
import {roomCollection} from '../db/collections';
import {fetchRoom} from './fetch-uzh';
import {makeRoomFromJson} from './uzh-converter';

const updateUzhRoom = async (job) => {
	const {id} = job.attrs.data;
	try {
		const roomJson = await fetchRoom(id, 2019, '003');
		const room = await makeRoomFromJson(roomJson);
		await roomCollection().updateOne(
			{
				id: room.id,
				university: room.university,
			},
			{$set: room},
			{upsert: true}
		);
	} catch (err) {
		if (err.message.match(/GDetails/)) {
			await roomCollection().deleteOne({
				university: UZH,
				id,
			});
		}
	}
};

export default updateUzhRoom;
