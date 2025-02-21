import {nextPeriod} from '../../../core/functions/validate-period';
import {currentPeriod} from '../../../core/models/current-period';
import Module from '../../../core/models/module';
import Semester from '../../../core/models/semester';
import {UPDATE_TIMETABLE} from '../../../core/models/task-type';
import {UZH} from '../../../core/models/university';
import {EventSerieType} from '../../../core/types/schedule';
import {moduleCollection} from '../db/collections';
import {connectToMongo} from '../db/modern';
import {insertTaskNative} from '../queue';

export const makeTask = (semester: Semester, event_serie: EventSerieType) => {
	return {
		Objid: event_serie.id as string,
		PiqYear:
			Math.floor(semester.period / 10) + (semester.period % 10 === 1 ? -1 : 0),
		PiqSession: semester.period % 10 === 1 ? '004' : '003',
	};
};

export const start = async () => {
	await connectToMongo();
	let cursor = moduleCollection().find({university: UZH});
	cursor = cursor.addCursorFlag('noCursorTimeout', true);
	const count = await cursor.count();

	for (let i = 0; i < count; i++) {
		const module: Module | null = await cursor.next();
		if (!module) {
			continue;
		}

		for (const semester of module.semesters.filter(
			(s) =>
				s.period === nextPeriod(currentPeriod) || s.period === currentPeriod
		)) {
			for (const event_serie of semester.event_series) {
				if (
					event_serie.id &&
					!event_serie.smart &&
					!/-exam/.exec(event_serie.id)
				) {
					await insertTaskNative(
						UPDATE_TIMETABLE,
						makeTask(semester, event_serie as EventSerieType)
					);
					console.log('inserted', event_serie.id);
				} else {
					console.log('no event serie id', event_serie);
				}
			}
		}
	}
};
