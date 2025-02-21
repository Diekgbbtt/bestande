import {EventSerieType} from '../../../core/types/schedule';
import {eventCollection, moduleCollection} from '../../src/db/collections';
import {updateUzhModuleInDb} from '../../src/tasks/update-uzh-module';
import {afterEach, beforeEach} from '../helpers/_hooks';
import {test} from '../helpers/_test-with-context';
import moduleDemo from './_module';

test.beforeEach(beforeEach);
test.afterEach.always(afterEach);

test('Should add exam correctly', async (t) => {
	await updateUzhModuleInDb(moduleDemo, moduleDemo);
	const mod = await moduleCollection().findOne({uni_identifier: '50642438'});
	t.true(
		(mod?.semesters[0].event_series as EventSerieType[]).find(
			(es) => es.id === '50642438-exam'
		)?.smart
	);
	const event = await eventCollection().findOne({
		event_serie_id: '50642438-exam',
	});
	t.deepEqual(event?.start_date, new Date('2018-02-22 12:15 UTC+1'));
});
