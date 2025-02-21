import {COUNT_USERS} from '../../../core/models/task-type';
import {UZH} from '../../../core/models/university';
import {saveModuleCollectionAnonymous} from '../../src/db/save-module-collection-anonymous';
import updateModuleStats from '../../src/tasks/update-user-count';
import {addDemoModule} from '../helpers/_add-demo-module';
import {beforeEach} from '../helpers/_hooks';
import {test} from '../helpers/_test-with-context';

test.beforeEach(beforeEach);

test('Should update user count', async (t) => {
	await addDemoModule();
	await saveModuleCollectionAnonymous({
		university: UZH,
		uni_identifier: '50430354',
		period: 'HS16',
		identifier: '4e0ed86a891ca212771976357e6f50d1',
		loggedOut: false,
	});
	const task = {
		type: COUNT_USERS,
		attrs: {
			data: {
				uni_identifier: '50430354',
				university: UZH,
			},
		},
	};
	const saved = await updateModuleStats(task);
	t.is(saved.userCount.all, 1);
});
