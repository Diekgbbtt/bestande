import got from 'got';
import Semester from '../../../core/models/semester';
import {EventSerieType} from '../../../core/types/schedule';
import {makeTask} from '../../src/tasks/timetable-tasks';
import updateUzhEvent from '../../src/tasks/update-uzh-event';
import {updateUzhModuleInDb} from '../../src/tasks/update-uzh-module';
import beforeApiTest from '../helpers/_before-api';
import {afterEach} from '../helpers/_hooks';
import {nativeModule} from '../helpers/_native-module';
import {test} from '../helpers/_test-with-context';

test.beforeEach(beforeApiTest);
test.afterEach.always(afterEach);

test('Should list semesters', async (t) => {
	const {body} = await got(
		`${t.context.api}/institution/uzh/module/50430354/semester`,
		{
			json: true,
		}
	);
	t.is(1, body.data.semesters.length);
});

test('Valid semester should return 200', async (t) => {
	const {body} = await got(
		`${t.context.api}/institution/uzh/module/50430354/semester/FS17`,
		{
			json: true,
		}
	);
	t.is('SWISS_HALF_GRADES', body.data.grading);
	t.is('FS17', body.data.period_human);
});

test('No valid semester should throw 404', async (t) => {
	try {
		await got(`${t.context.api}/institution/uzh/module/50430354/semester/FS10`);
	} catch (err) {
		t.is(404, err.statusCode);
	}
});

test('Should add events to timetable', async (t) => {
	const result = await updateUzhModuleInDb(nativeModule, nativeModule);
	const sampleSemester = result?.semesters[0];
	const sampleEventSerie = sampleSemester?.event_series[0];
	const task = makeTask(
		sampleSemester as Semester,
		sampleEventSerie as EventSerieType
	);
	await updateUzhEvent({type: 'UPDATE_TIMETABLE', attrs: {data: task}});

	const {body} = await got(
		`${t.context.api}/institution/uzh/module/${nativeModule.SmObjId}/semester/FS21/timetable`,
		{
			json: true,
		}
	);
	const serie = body.data.data[0];
	t.is(serie.people.length, 1);
	t.is(serie.events.length, 14);
	t.is(sampleSemester?.instructors.length, 1);
});
