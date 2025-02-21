import xns from 'xns';
import Module from '../core/models/module';
import {moduleCollection} from '../web/src/db/collections';
import {connectToMongo} from '../web/src/db/modern';
import updateModuleStats from '../web/src/tasks/update-user-count';

const periods = [20201, 20202];

xns(async () => {
	let i = 0;
	await connectToMongo();
	const totalCount = await moduleCollection().countDocuments({
		'semesters.period': {$in: periods},
	});
	let moduleCursor = moduleCollection().find({
		'semesters.period': {$in: periods},
	});

	moduleCursor = moduleCursor.addCursorFlag('noCursorTimeout', true);

	while (await moduleCursor.hasNext()) {
		const nextMod: Module = (await moduleCursor.next()) as Module;
		await updateModuleStats({
			attrs: {
				data: {
					_mod: nextMod,
				},
			},
		});
		console.log(
			`${i++}/${totalCount} ${nextMod.short_name} (${
				nextMod.userCount.all
			} users, ${nextMod.ratingSummary.average?.toFixed(1)} rating)`
		);
	}
});
