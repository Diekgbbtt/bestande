import {makeTask} from '../../src/tasks/timetable-tasks';
import {test} from '../helpers/_test-with-context';

test('Should make correct task', (t) => {
	// @ts-expect-error
	const task = makeTask({period: 20172}, {id: 123567});
	t.is(task.PiqSession, '003');
});
