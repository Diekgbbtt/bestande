import {
	UPDATE_ROOM_UZH,
	UPDATE_TIMETABLE,
} from '../../../core/models/task-type';
import {UZH} from '../../../core/models/university';
import {eventCollection, roomCollection} from '../../src/db/collections';
import updateUzhEvent from '../../src/tasks/update-uzh-event';
import updateUzhRoom from '../../src/tasks/update-uzh-room';
import {afterEach, beforeEach} from '../helpers/_hooks';
import {test} from '../helpers/_test-with-context';

test.beforeEach(beforeEach);
test.afterEach.always(afterEach);

const job = {
	type: UPDATE_TIMETABLE,
	attrs: {
		data: {
			Objid: '50945958',
			PiqYear: 2019,
			PiqSession: '003',
		},
	},
};

const roomJob = {
	type: UPDATE_ROOM_UZH,
	attrs: {
		data: {
			university: UZH,
			id: '49000453',
		},
	},
};

test('Should correctly fetch events and update, then update the room', async (t) => {
	await updateUzhEvent(job);
	const count = await eventCollection().countDocuments({});
	const roomCount = await roomCollection().countDocuments({});

	t.is(count, 13);
	t.is(roomCount, 5);
	await updateUzhRoom(roomJob);

	const room = await roomCollection().findOne({id: roomJob.attrs.data.id});
	t.is(room?.address, 'Karl Schmid-Strasse 4\n8006 Zürich');
});
