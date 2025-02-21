import uniq from 'lodash/uniq';
import departments from '../../../core/models/eth-departments';
import {ETH} from '../../../core/models/university';
import {Job} from '../../../core/types/types';
import {moduleCollection} from '../db/collections';
import {getIdsFromPage} from './eth-converter';
import {fetchDepartmentPage} from './fetch-eth';

const updateEthDepartment = async (
	job: Job<{
		semester: string;
		departmentId: string;
		page: number;
	}>
) => {
	const {semester, departmentId, page} = job.attrs.data;
	const {body} = await fetchDepartmentPage(semester, departmentId, page);
	for (const uni_identifier of getIdsFromPage(body.toString())) {
		const moduleInDb = await moduleCollection().findOne({
			university: ETH,
			uni_identifier,
		});
		if (!moduleInDb) {
			continue;
		}

		const newDepartments = uniq([
			...(moduleInDb.departments || []),
			departments[departmentId],
		]);
		await moduleCollection().updateOne(
			{
				uni_identifier,
				university: ETH,
			},
			{
				$set: {
					departments: newDepartments,
				},
			}
		);
		console.log(
			'department',
			departmentId,
			'page',
			page,
			semester,
			uni_identifier
		);
	}
};

export default updateEthDepartment;
