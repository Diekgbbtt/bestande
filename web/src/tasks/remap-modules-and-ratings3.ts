import xns from 'xns';
import {Institution} from '../../../core/models/credit';
import Module from '../../../core/models/module';
import {RatingBaseCore} from '../../../core/types/ratings';
import {moduleCollection, ratingsCollection} from '../db/collections';
import {connectToMongo} from '../db/modern';
import Rating from '../models/rating';
require('dotenv').config();

const lateSemesters = ['HS22', 'FS23', 'HS23', 'FS24'];
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
		if (moduleOnlyHasPriorToHS22(module) && module.semesters.length > 1) {
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
		if (moduleOnlyHasHS22OrLater(module) && module.semesters.length > 0) {
			includedModules.push(module);
		}
	}
	includedModules.sort((a, b) => {
		return (a.name || '') > (b.name || '') ? 1 : -1;
	});

	return includedModules;
};

function mapRatingsToLateModule(
	oldModule: Module,
	newModule: Module,
	ratings: Rating[]
) {
	for (const rating of ratings) {
		if (rating.uni_identifier === oldModule.uni_identifier) {
			rating.uni_identifier = newModule.uni_identifier;
		}
	}
}

function areModulesAtSameTime(module1: Module, module2: Module) {
	const periods: number[] = [];
	for (const module of [module1, module2]) {
		for (const semester of module.semesters) {
			periods.push(semester.period);
		}
	}
	const uniquePeriods = [...new Set(periods)];
	return uniquePeriods.length !== periods.length;
}

interface AnonymizedRating {
	_id: string;
	review: string;
	score: number;
	university: string;
	course: string;
	upvotes: number;
	downvotes: number;
	date: number;
	courseName: string;
	courseNameShort: string;
}

function mapToNewRating(ratings: AnonymizedRating[]): Rating[] {
	const allnewRatings: Rating[] = [];
	for (const rating of ratings) {
		//Upvotes and downvotes missing
		const ratingBase: RatingBaseCore = {
			score: rating.score,
			review: rating.review,
			uni_identifier: rating.course,
			university: rating.university as Institution,
			name: rating.courseName,
			grade: null,
			direction: null,
			_id: rating._id,
			date: rating.date,
		};
		const newRating = new Rating(ratingBase);

		allnewRatings.push(newRating);
	}
	return allnewRatings;
}

function findMatchingModules(moduleToMatch: Module, allModules: Module[]): Module[] {
	const matchingModules: Module[] = [];
	for (const module of allModules) {
		if (module.faculty !== moduleToMatch.faculty) {
			continue;
		}
		if (
			module.short_name === moduleToMatch.short_name ||
			module.name === moduleToMatch.name
		) {
			matchingModules.push(module);
		}
	}
	return matchingModules;
}

xns(async () => {
	await connectToMongo();
	const modules: Module[] = await moduleCollection().find().toArray();
	// const ratings: AnonymizedRating[] = ((await ratingsCollection()
	// 	.find()
	// 	.toArray()) as unknown) as AnonymizedRating[];
	// const ratingsMapped: Rating[] = mapToNewRating(ratings);
	const ratingsMapped: Rating[] = await ratingsCollection().find().toArray();
	const laterModules = getModulesHS22OrLater(modules);
	const earlyModules = modules.filter((m) => !laterModules.includes(m));

	for (const lateModule of laterModules) {
		const matchingModules = findMatchingModules(lateModule, earlyModules).sort(
			(a, b) => a.semesters.length - b.semesters.length
		);
		for (const matchingEarlyModule of matchingModules) {
			if (areModulesAtSameTime(lateModule, matchingEarlyModule)) {
				continue;
			}
			for (const earlySemester of matchingEarlyModule.semesters) {
				if (
					!lateModule.semesters.find(
						(s) => s.period === earlySemester.period
					)
				) {
					lateModule.semesters.push(earlySemester);
				}
			}
			mapRatingsToLateModule(matchingEarlyModule, lateModule, ratingsMapped);
			modules.splice(modules.indexOf(matchingEarlyModule), 1);
			break;
		}
	}

	await moduleCollection().deleteMany({});
	await moduleCollection().insertMany(modules);
	await ratingsCollection().deleteMany({});
	await ratingsCollection().insertMany(ratingsMapped as any);
});
