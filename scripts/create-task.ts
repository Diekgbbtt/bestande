import {UPDATE_MODULE_UZH} from '../core/models/task-type';
import {insertTaskNative} from '../web/src/queue';

const createTask = async () => {
	await insertTaskNative(UPDATE_MODULE_UZH, {
		uni_identifier: '50030855',
		year: '2017',
		semester: '004',
	});
};

createTask()
	.then(() => process.exit(0))
	.catch((err) => console.log(err));
