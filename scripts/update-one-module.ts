import xns from 'xns';
import {UZH} from '../core/models/university';
import updateModuleStats from '../web/src/tasks/update-user-count';

xns(async () => {
	await updateModuleStats({
		attrs: {
			data: {
				uni_identifier: '50327239',
				university: UZH,
			},
		},
		type: 'UPDATE_MODULE_UZH',
	});
	await updateModuleStats({
		attrs: {
			data: {
				uni_identifier: '50987904',
				university: UZH,
			},
		},
	});
});
