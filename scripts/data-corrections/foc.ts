import Module from '../../core/models/module';
import Semester from '../../core/models/semester';
import {UZH} from '../../core/models/university';
import {moduleCollection} from '../../web/src/db/collections';

export const updateFoc = async () => {
	const foc1 = (await moduleCollection().findOne({
		uni_identifier: '50821425',
		university: UZH,
	})) as Module;
	const semesters = foc1?.semesters.map(
		(s): Semester => {
			if (s.period !== 20181 && s.period !== 20201) {
				return s;
			}

			return {
				...s,
				instructors: s.instructors.filter((i) => {
					return i.id !== '01064885';
				}),
				responsible: (s.responsible as string[]).filter((i) => {
					return i !== '01064885';
				}),
			};
		}
	);
	await moduleCollection().updateOne(
		{
			uni_identifier: foc1.uni_identifier,
			university: foc1.university,
		},
		{
			$set: {
				semesters,
			},
		}
	);
};
