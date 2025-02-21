const {xns} = require('xns');
const execa = require('execa');

const static = [
	'app/common/assets',
	'web/src/static',
	'web/src/styles',
	'web/src/data',
	'web/src/html',
	'core/assets',
	'web/test/uzh/demos',
	'web/test/eth/demos',
];

xns(async () => {
	for (const folder of static) {
		const splitted = folder.split('/');
		const allButLast = splitted.slice(0, splitted.length - 1);
		await execa('rm', ['-rf', `dist/${folder}`]);
		await execa('mkdir', ['-p', `dist/${allButLast.join('/')}`]);
		await execa('cp', ['-R', folder, `dist/${allButLast.join('/')}`]);
	}
});
