import {ethSemesters} from '../../../core/data/eth-semesters';
import departments from '../../../core/models/eth-departments';
import {UPDATE_DEPARTMENTS_ETH} from '../../../core/models/task-type';
import {insertTaskNative} from '../queue';
import {fetchDepartmentPage} from './fetch-eth';

const departmentIds = Object.keys(departments);

const start = async () => {
	for (const semester of ethSemesters) {
		for (const departmentId of departmentIds) {
			const {total} = await fetchDepartmentPage(semester, departmentId);
			for (let page = 1; page <= total; page++) {
				await insertTaskNative(UPDATE_DEPARTMENTS_ETH, {
					departmentId,
					page,
					semester,
				});
			}
		}
	}
};

export default start;
