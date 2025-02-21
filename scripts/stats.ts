import leftPad from 'left-pad';
import xns from 'xns';
import {impressionsCollection} from '../web/src/db/collections';

xns(async () => {
	const months = new Array(12).fill(true).map((_, index) => {
		const _start = new Date(`2019-${leftPad(index + 1, 2, '0')}-01`).getTime();
		const end =
			index === 11
				? new Date('2019-01-01').getTime()
				: new Date(`2019-${leftPad(index + 2, 2, '0')}-01`).getTime();
		return [_start, end];
	});
	for (const period of months) {
		const impressions = await impressionsCollection().countDocuments({
			content: 'HOMEPAGE',
			date: {$lt: period[1], $gt: period[0]},
		});
		console.log(period, impressions);
	}

	console.log(months);
});
