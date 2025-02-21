import xns from 'xns';
import {connectToMongo} from '../db/modern';
import {moduleCollection} from '../db/collections';
import Module from '../../../core/models/module';
var fs = require('fs');
require('dotenv').config();

const lateSemesters = ['FS22', 'HS22', 'FS23', 'HS23', 'FS24'];

const moduleOnlyHasPriorToFS22 = (module: Module): boolean => {
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

const getModulesBeforeFS22 = (modules: Module[]): Module[] => {
	const includedModules: Module[] = [];
	for (const module of modules) {
		if (moduleOnlyHasPriorToFS22(module)) {
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
	const modulesBeforeFS22 = getModulesBeforeFS22(modules);

	const modulesAfterFS22 = modules.filter((module) => {
		return !modulesBeforeFS22.find(
			(m) => m.uni_identifier === module.uni_identifier
		);
	});

	await moduleCollection().deleteMany({});
	await moduleCollection().insertMany(modulesAfterFS22);
});
