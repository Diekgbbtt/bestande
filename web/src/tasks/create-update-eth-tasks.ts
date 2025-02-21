import {ethSemesters} from '../../../core/data/eth-semesters';
import {UPDATE_MODULE_ETH} from '../../../core/models/task-type';
import {insertTaskNative} from '../queue';
import {getUniIdentifiersFromHtml} from './eth-converter';
import {fetchListPage} from './fetch-eth';

const processList = async (list: string[], semester: string) => {
	for (const uni_identifier of list) {
		await insertTaskNative(UPDATE_MODULE_ETH, {
			uni_identifier,
			semester,
		});
		console.log('inserted', uni_identifier);
	}
};

export const createUpdateEthTasks = async () => {
	for (const semester of ethSemesters) {
		const page = 1;
		const objs = [];
		const [total, body] = await fetchListPage(semester, 1);
		await processList(getUniIdentifiersFromHtml(body.toString()), semester);
		for (let i = page + 1; i <= total; i++) {
			const [, _body] = await fetchListPage(semester, i);
			await processList(getUniIdentifiersFromHtml(_body.toString()), semester);
			console.log('Fetched page', i);
		}

		console.log('Modules in ' + semester, objs.length);
	}
};
