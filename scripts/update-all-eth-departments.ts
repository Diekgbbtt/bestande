import xns from 'xns';
import {ethSemesters} from '../core/data/eth-semesters';
import departments from '../core/models/eth-departments';
import {connectToMongo} from '../web/src/db/modern';
import {fetchDepartmentPage} from '../web/src/tasks/fetch-eth';
import updateEthDepartment from '../web/src/tasks/update-eth-departments';

const departmentIds = Object.keys(departments);

xns(async () => {
	await connectToMongo();
	for (const semester of ethSemesters) {
		for (const departmentId of departmentIds) {
			const {total} = await fetchDepartmentPage(semester, departmentId);
			for (let page = 1; page <= total; page++) {
				await updateEthDepartment({
					attrs: {
						data: {
							departmentId,
							page,
							semester,
						},
					},
				});
			}
		}
	}
});
