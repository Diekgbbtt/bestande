import {UPDATE_ROOM_ETH, UPDATE_ROOM_UZH} from '../../../core/models/task-type';
import {ETH, UZH} from '../../../core/models/university';
import {roomCollection} from '../db/collections';
import {connectToMongo} from '../db/modern';
import {insertTaskNative} from '../queue';

const start = async () => {
	await connectToMongo();
	const cursor = roomCollection().find({});
	const count = await cursor.count();
	for (let i = 0; i < count; i++) {
		const mod = await cursor.next();
		if (!mod) {
			continue;
		}

		const {university, id} = mod;
		if (university === UZH) {
			await insertTaskNative(UPDATE_ROOM_UZH, {
				university,
				id,
			});
		} else if (university === ETH) {
			await insertTaskNative(UPDATE_ROOM_ETH, {
				university,
				id,
			});
		}
	}
};

export default start;
