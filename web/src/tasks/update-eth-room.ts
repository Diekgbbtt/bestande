import {Job} from '../../../core/types/types';
import {roomCollection} from '../db/collections';
import {makeRoomFromHtml} from './eth-converter';
import {fetchRoom} from './fetch-eth';

const updateEthRoom = async (
	job: Job<{
		id: string;
	}>
) => {
	const {id} = job.attrs.data;
	const roomHtml = await fetchRoom(id);
	const room = await makeRoomFromHtml(id, roomHtml);
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
};

export default updateEthRoom;
