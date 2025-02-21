import xns from 'xns';
import {Institution} from '../../../core/models/credit';
import Module from '../../../core/models/module';
import {RatingBaseCore} from '../../../core/types/ratings';
import {moduleCollection, ratingsCollection} from '../db/collections';
import {connectToMongo} from '../db/modern';
import Rating from '../models/rating';
require('dotenv').config();

const lateSemesters = ['HS22', 'FS23', 'HS23', 'FS24'];
const earlySemesters = ['HS20', 'FS21', 'HS21', 'FS22'];

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
		if (moduleOnlyHasHS22OrLater(module) && module.semesters.length > 1) {
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

function findMatchForLateModule(
	module: Module,
	earlyModules: Module[]
): Module | undefined {
	for (const earlyModule of earlyModules) {
		if (earlyModule.faculty !== module.faculty) {
			continue;
		}
		if (earlyModule.short_name === module.short_name) {
			return earlyModule;
		}
		if (earlyModule.name === module.name) {
			return earlyModule;
		}
	}
}

xns(async () => {
	await connectToMongo();
	const modules: Module[] = await moduleCollection().find().toArray();
	const ratings: AnonymizedRating[] = ((await ratingsCollection()
		.find()
		.toArray()) as unknown) as AnonymizedRating[];
	const ratingsMapped: Rating[] = mapToNewRating(ratings);
	const exclusivelyEarlyModules = getModulesBeforeHS22(modules);
	const exclusivelyLateModules = getModulesHS22OrLater(modules);

	for (const lateModule of exclusivelyLateModules) {
		const earlyModule = findMatchForLateModule(
			lateModule,
			exclusivelyEarlyModules
		);
		if (earlyModule) {
			for (const semester of earlyModule.semesters) {
				lateModule.semesters.push(semester);
			}
			mapRatingsToLateModule(earlyModule, lateModule, ratingsMapped);
			modules.splice(modules.indexOf(earlyModule), 1);
		}
	}

	await moduleCollection().deleteMany({});
	await moduleCollection().insertMany(modules);
	await ratingsCollection().deleteMany({});
	await ratingsCollection().insertMany(ratingsMapped as any);
});
