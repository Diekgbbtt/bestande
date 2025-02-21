import xns from 'xns';
import {connectToMongo} from '../db/modern';
import {moduleCollection} from '../db/collections';
import Module from '../../../core/models/module';
var fs = require('fs');
require('dotenv').config();

const lateSemesters = ['FS22', 'HS22', 'FS23', 'HS23', 'FS24'];
const earlySemesters = ['HS18', 'FS19', 'HS19', 'FS20', 'HS20', 'FS21', 'HS21'];

const moduleOnlyHasHS22OrLater = (module: Module): boolean => {
	for (const semester of module.semesters) {
		if (
			earlySemesters.find(
				(s) => s.toLowerCase() === semester.period_human.toLowerCase()
			)
		) {
			return false;
		}
	}
	return true;
};

const moduleOnlyHasPriorToHS22 = (module: Module): boolean => {
	for (const semester of module.semesters) {
		if (
			lateSemesters.find(
				(s) => s.toLowerCase() === semester.period_human.toLowerCase()
			)
		) {
			return false;
		}
	}
	return true;
};

const getModulesBeforeHS22 = (modules: Module[]): Module[] => {
	const includedModules: Module[] = [];
	for (const module of modules) {
		if (moduleOnlyHasPriorToHS22(module)) {
			includedModules.push(module);
		}
	}
	includedModules.sort((a, b) => {
		return (a.name || '') > (b.name || '') ? 1 : -1;
	});

	return includedModules;
};

const getModulesHS22OrLater = (modules: Module[]): Module[] => {
	const includedModules: Module[] = [];
	for (const module of modules) {
		if (moduleOnlyHasHS22OrLater(module) && module.semesters.length > 1) {
			includedModules.push(module);
		}
	}
	includedModules.sort((a, b) => {
		return (a.name || '') > (b.name || '') ? 1 : -1;
	});

	return includedModules;
};

xns(async () => {
	await connectToMongo();
	const modules: Module[] = await moduleCollection().find().toArray();
	const modulesBeforeHS21 = getModulesBeforeHS22(modules);
	const modulesHS21OrLater = getModulesHS22OrLater(modules);
	const minifiedBeforeHS21 = modulesBeforeHS21.map((m) => ({
		name: m.name,
		short_name: m.short_name,
		uni_identifier: m.uni_identifier,
		semestersLength: m.semesters.length,
		translatedNames: m.translatedNames,
		faculty: m.faculty,
	}));

	const minifiedHS21OrLater = modulesHS21OrLater.map((m) => ({
		name: m.name,
		short_name: m.short_name,
		uni_identifier: m.uni_identifier,
		semestersLength: m.semesters.length,
		translatedNames: m.translatedNames,
		faculty: m.faculty,
	}));

	const stringifiedModulesBeforeHS21 = JSON.stringify(minifiedBeforeHS21);
	const stringifiedModulesHS21OrLater = JSON.stringify(minifiedHS21OrLater);
	console.log('modulesBeforeHS22', modulesBeforeHS21.length);
	console.log('modulesHS22OrLater', modulesHS21OrLater.length);
	fs.writeFileSync(
		'updatedModulesBeforeHS22.json',
		stringifiedModulesBeforeHS21,
		'utf-8'
	);
	fs.writeFileSync(
		'updatedModulesHS22OrLater.json',
		stringifiedModulesHS21OrLater,
		'utf-8'
	);
});
