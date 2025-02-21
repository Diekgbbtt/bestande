import Module from '../../../core/models/module';
import Semester from '../../../core/models/semester';
import {moduleCollection} from './collections';
import {connectToMongo} from './modern';

export const addSemester = async (
	mod: Module,
	semester: Semester
): Promise<Module> => {
	await connectToMongo();
	// Get copy from DB or use unsaved object instead
	const moduleInDb = await moduleCollection().findOne({
		university: mod.university,
		uni_identifier: mod.uni_identifier,
	});
	const _module = moduleInDb ? moduleInDb : mod;

	if (mod.name) {
		_module.name = mod.name;
		_module.short_name = mod.short_name;
		_module.translatedNames = mod.translatedNames;
	}

	// Ensure it has a semesters array
	if (!_module.semesters) {
		_module.semesters = [];
	}

	// Add or update semester
	const exists = _module.semesters.findIndex(
		(m) => semester.period === m.period
	);
	if (exists > -1) {
		_module.semesters[exists] = new Semester({
			..._module.semesters[exists],
			...semester,
		});
	} else {
		_module.semesters.push(semester);
	}

	// Save / Insert module
	await moduleCollection().updateOne(
		{
			uni_identifier: _module.uni_identifier,
			university: _module.university,
		},
		{$set: _module},
		{
			upsert: true,
		}
	);
	return new Module(_module);
};
