import xns from 'xns';
import {Institution} from '../../../core/models/credit';
import Module from '../../../core/models/module';
import {RatingBaseCore} from '../../../core/types/ratings';
import {moduleCollection, ratingsCollection} from '../db/collections';
import {connectToMongo} from '../db/modern';
import Rating from '../models/rating';
import {map} from 'lodash';
import {WithId} from 'mongodb';
require('dotenv').config();

// DB can be set via MONGODB_URI in the /.env file

console.log(process.env.MONGODB_URI);

interface ModuleMapping {
	oldModuleId: string;
	newModuleId: string;
}

const oldModules = [50923133];

const newModules = [51144595];

async function mapRatingsToLateModule(
	oldModule: WithId<Module>,
	newModule: WithId<Module>,
	ratings: Rating[]
) {
	console.log(
		'Mapping ratings for module: ',
		oldModule.name,
		' to ',
		newModule.name
	);
	await ratingsCollection().updateMany(
		{uni_identifier: oldModule.uni_identifier},
		{$set: {uni_identifier: newModule.uni_identifier}}
	);

	for (const semester of oldModule.semesters) {
		if (
			!newModule.semesters.find(
				(s) => s.period_human === semester.period_human
			)
		) {
			newModule.semesters.push(semester);
		}
	}
	await moduleCollection().deleteOne({_id: oldModule._id});
	await moduleCollection().updateOne(
		{_id: newModule._id},
		{$set: {semesters: newModule.semesters}}
	);
}

xns(async () => {
	await connectToMongo();
	const modules: WithId<
		Module[]
	> = (await moduleCollection().find().toArray()) as any;
	const ratings: Rating[] = await ratingsCollection().find().toArray();

	const mappings: ModuleMapping[] = [];
	if (oldModules.length !== newModules.length) {
		throw new Error('Lengths do not match');
	}

	for (let i = 0; i < oldModules.length; i++) {
		mappings.push({
			oldModuleId: oldModules[i].toString(),
			newModuleId: newModules[i].toString(),
		});
	}

	for (const mapping of mappings) {
		const oldModule = modules.find(
			(m) => m.uni_identifier === mapping.oldModuleId
		);
		const newModule = modules.find(
			(m) => m.uni_identifier === mapping.newModuleId
		);
		if (!oldModule || !newModule) {
			continue;
		}
		await mapRatingsToLateModule(
			oldModule as WithId<Module>,
			newModule as WithId<Module>,
			ratings
		);
	}
});
