import execa from 'execa';
import xns from 'xns';
import {ethSemesters} from '../core/data/eth-semesters';
import {UPDATE_MODULE_ETH} from '../core/models/task-type';
import {Job} from '../core/types/types';
import {connectToMongo} from '../web/src/db/modern';
import {getUniIdentifiersFromHtml} from '../web/src/tasks/eth-converter';
import {fetchListPage} from '../web/src/tasks/fetch-eth';
import updateEthModule from '../web/src/tasks/update-eth-module';

const processList = async (list: string[], semester: string) => {
	let i = 0;
	for (const uni_identifier of list) {
		const task: Job<{
			uni_identifier: string;
			semester: string;
		}> = {
			type: UPDATE_MODULE_ETH,
			attrs: {
				data: {
					semester,
					uni_identifier,
				},
			},
		};
		await updateEthModule(task);
		i++;
		console.log(`Item ${i}/${list.length} in list done:`, uni_identifier);
	}
};

const getPage = async (semester: string, total: number) => {
	const pageRes = await execa('curl', [
		`https://increment.build/bestande-eth-courses-${semester}`,
	]);
	const {stdout} = pageRes;
	const page = Number(stdout);
	return [page % total, Math.floor(page / total)];
};

const maxPagesPerBatch = 60;
let currentIndex = 0;
xns(async () => {
	await connectToMongo();
	for (const semester of ethSemesters) {
		const [total, body] = await fetchListPage(semester, 1);
		await processList(getUniIdentifiersFromHtml(body.toString()), semester);
		let [page, iteration] = await getPage(semester, total as number);
		const initialIteration = iteration;
		while (page <= total && iteration === initialIteration) {
			if (currentIndex >= maxPagesPerBatch) {
				console.log(`Already did ${currentIndex} pages.`);
				process.exit(0);
			}

			const [, _body] = await fetchListPage(semester, page);
			await processList(getUniIdentifiersFromHtml(_body.toString()), semester);
			console.log('Fetched page', page, 'out of', total);
			currentIndex++;
			[page, iteration] = await getPage(semester, total as number);
		}

		console.log('Done with ' + semester);
	}
});
