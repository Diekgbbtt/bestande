import xns from 'xns';

const _name = process.argv[2];

const task = require(`../src/tasks/${_name}`);

xns(() => {
	task.default();
});
