import {CREATE_TIMETABLE_TASKS} from '../core/models/task-type';
import {insertTaskNative} from '../web/src/queue';

const createTimetableTask = async () => {
	await insertTaskNative(CREATE_TIMETABLE_TASKS, {});
};

createTimetableTask()
	.then(() => process.exit(0))
	.catch((err) => console.log(err));
