import xns from 'xns';
import {Institution} from '../../../core/models/credit';
import Module from '../../../core/models/module';
import {RatingBaseCore} from '../../../core/types/ratings';
import {moduleCollection, ratingsCollection} from '../db/collections';
import {connectToMongo} from '../db/modern';
import Rating from '../models/rating';
const fs = require('fs');

interface ModuleGroupedByShortName {
	[short_name: string]: Module[];
}

function groupByShortName(modules: Module[]): ModuleGroupedByShortName {
	const modulesGroupedByShortName: ModuleGroupedByShortName = {};
	for (const module of modules) {
		if (!module?.short_name) {
			continue;
		}
		if (!modulesGroupedByShortName[module.short_name]) {
			modulesGroupedByShortName[module.short_name] = [];
		}
		modulesGroupedByShortName[module.short_name].push(module);
	}

	return modulesGroupedByShortName;
}

function areModulesAtSameTime(modules: Module[]): boolean {
	const periods: number[] = [];
	for (const module of modules) {
		for (const semester of module.semesters) {
			periods.push(semester.period);
		}
	}
	const uniquePeriods = [...new Set(periods)];
	return uniquePeriods.length !== periods.length;
}

function removeRatings(allRatings: Rating[], changedRatings: Rating[]): void {
	for (const changedRating of changedRatings) {
		const index = allRatings.findIndex(
			(rating) => rating._id === changedRating._id
		);
		if (index !== -1) {
			allRatings.splice(index, 1);
		}
	}
}

function addModulesToNewestModule(
	modules: Module[],
	allRatings: Rating[],
	allNewRatings: Rating[]
): Module | undefined {
	const periods: number[] = [];
	for (const module of modules) {
		for (const semester of module.semesters) {
			periods.push(semester.period);
		}
	}
	const newestPeriod = Math.max(...periods);
	let newestModule: Module | undefined;
	for (const module of modules) {
		if (module.semesters.find((semester) => semester.period === newestPeriod)) {
			newestModule = module;
			break;
		}
	}
	if (!newestModule) {
		return;
	}
	for (const module of modules) {
		if (module !== newestModule) {
			newestModule.semesters.push(...module.semesters);
		}
		const changedRatings = allRatings.filter(
			(rating) => rating.uni_identifier === module.uni_identifier
		);
		for (const rating of changedRatings) {
			rating.uni_identifier = newestModule.uni_identifier;
		}
		allNewRatings.push(...changedRatings);
		removeRatings(allRatings, changedRatings);
	}
	return newestModule;
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

xns(async () => {
	await connectToMongo();
	const modules: Module[] = await moduleCollection().find().toArray();
	const ratings: AnonymizedRating[] = ((await ratingsCollection()
		.find()
		.toArray()) as unknown) as AnonymizedRating[];
	const ratingsMapped = mapToNewRating(ratings);
	const modulesGroupedByShortName = groupByShortName(modules);
	const allNewModules: Module[] = [];
	const allNewRatings: Rating[] = [];
	for (const key of Object.keys(modulesGroupedByShortName)) {
		const modulesOfKey = modulesGroupedByShortName[key];
		if (areModulesAtSameTime(modulesOfKey)) {
			allNewModules.push(...modulesOfKey);
		} else {
			const newestModule = addModulesToNewestModule(
				modulesOfKey,
				ratingsMapped,
				allNewRatings
			);
			if (newestModule) {
				allNewModules.push(newestModule);
			}
		}
	}
	allNewRatings.push(...ratingsMapped);
	await moduleCollection().deleteMany({});
	await moduleCollection().insertMany(allNewModules);
	await ratingsCollection().deleteMany({});
	await ratingsCollection().insertMany(allNewRatings as any);
});
