import xns from 'xns';
import {connectToMongo} from '../db/modern';
import {moduleCollection, ratingsCollection} from '../db/collections';
import Module from '../../../core/models/module';
import Rating from '../models/rating';
var fs = require('fs');
require('dotenv').config();

const lateSemesters = ['FS22', 'HS22', 'FS23', 'HS23', 'FS24'];
const earlySemesters = ['HS20', 'FS21', 'HS21'];

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
	const ratings: Rating[] = await ratingsCollection().find().toArray();

	const sortModules = (moduleA: Module, moduleB: Module): number => {
		const ratingCountA = ratings.filter(
			(r) => r.uni_identifier === moduleA.uni_identifier
		).length;
		const ratingCountB = ratings.filter(
			(r) => r.uni_identifier === moduleB.uni_identifier
		).length;
		if (ratingCountA > ratingCountB) {
			return -1;
		} else if (ratingCountA < ratingCountB) {
			return 1;
		}
		return 0;
	};

	const modulesBeforeHS21 = getModulesBeforeHS22(modules);
	const modulesHS21OrLater = getModulesHS22OrLater(modules);
	modulesBeforeHS21.sort(sortModules);
	modulesHS21OrLater.sort(sortModules);

	const minifiedBeforeHS21 = modulesBeforeHS21.map((m) => ({
		name: m.name,
		short_name: m.short_name,
		amountOfRatings: ratings.filter((r) => r.uni_identifier === m.uni_identifier)
			.length,
		uni_identifier: m.uni_identifier,
		semestersLength: m.semesters.length,
		translatedNames: m.translatedNames,
		faculty: m.faculty,
	}));

	const minifiedHS21OrLater = modulesHS21OrLater.map((m) => ({
		name: m.name,

		short_name: m.short_name,
		amountOfRatings: ratings.filter((r) => r.uni_identifier === m.uni_identifier)
			.length,
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
		'updatedAndOrderedModulesBeforeHS22.json',
		stringifiedModulesBeforeHS21,
		'utf-8'
	);
	fs.writeFileSync(
		'updatedAndOrderedModulesHS22OrLater.json',
		stringifiedModulesHS21OrLater,
		'utf-8'
	);
});
