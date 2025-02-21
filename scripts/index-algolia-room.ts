import fs from 'fs';
import {getRoomSearchModel} from '../core/models/room';
import {roomCollection} from '../web/src/db/collections';
import {connectToMongo} from '../web/src/db/modern';

const start = async () => {
	console.log('Creating room index...');
	const objects: any[] = [];

	await connectToMongo();
	const count = await roomCollection().countDocuments({});
	let progress = 0;
	const cursor = roomCollection().find({});

	while (await cursor.hasNext()) {
		const room = await cursor.next();
		if (!room) {
			throw new Error('Room does not exist');
		}

		if (
			['see Notes', '', '00_E-Externer Raum', '00_E-ETH-Raum'].some(
				(name) => room.name === name
			)
		) {
			continue;
		}

		objects.push({
			objectID: `${room.university}/${room.id}`,
			...getRoomSearchModel(room),
		});
		progress++;
		if (progress % 100 === 0) {
			console.log(`rooms, ${progress}/${count}`);
		}
	}

	fs.writeFileSync('algolia-rooms.json', JSON.stringify(objects));
};

export default start;
