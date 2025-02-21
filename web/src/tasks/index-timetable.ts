import xns from 'xns';
import {UPDATE_TIMETABLE} from '../../../core/models/task-type';
import {EventSerieType} from '../../../core/types/schedule';
import {moduleCollection} from '../db/collections';
import {connectToMongo} from '../db/modern';
import {insertTaskNative} from '../queue';
import {makeTask} from './timetable-tasks';

xns(async () => {
	connectToMongo();
	const modules = await moduleCollection()
		.find({uni_identifier: '50033813'})
		.toArray();

	const [_module] = modules;
	for (const semester of _module.semesters) {
		for (const event_serie of semester.event_series) {
			const task = makeTask(semester, event_serie as EventSerieType);
			await insertTaskNative(UPDATE_TIMETABLE, task);
		}
	}

	return true;
});
