import xns from 'xns';
import {doMultipleTasks} from '../web/src/task-queue/do-tasks';

xns(async () => {
	// eslint-disable-next-line  no-constant-condition
	while (true) {
		await doMultipleTasks(1);
	}
});
