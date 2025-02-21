import Module from '../../core/models/module';
import Semester from '../../core/models/semester';
import {UZH} from '../../core/models/university';
import {moduleCollection} from '../../web/src/db/collections';

// Wrongly attributed to Dr. phil. Annekatrin Steinhoff

export const fixAdvancedModule = async () => {
	// Remove wrong responsibility
	const advancedModule = (await moduleCollection().findOne({
		uni_identifier: '50423700',
		university: UZH,
	})) as Module;
	const advancedModuleSemesters = advancedModule?.semesters.map(
		(s): Semester => {
			return {
				...s,
				instructors: (s.instructors || []).filter((i) => {
					return i.id !== '01100297';
				}),
				responsible: ((s.responsible || []) as string[]).filter((i) => {
					return i !== '01100297';
				}),
			};
		}
	);
	await moduleCollection().updateOne(
		{
			uni_identifier: advancedModule.uni_identifier,
			university: advancedModule.university,
		},
		{
			$set: {
				semesters: advancedModuleSemesters,
			},
		}
	);
};
