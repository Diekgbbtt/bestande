import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';
import {
	Instructor,
	InstructorWithTypeArray,
} from '../../../core/types/instructor';

export const mergePeople = (
	flattened: Instructor[]
): InstructorWithTypeArray[] => {
	const grouped = groupBy(flattened, (f) => f.id);
	const merged = uniq(flattened.map((f) => f.id)).map((key) => {
		return {
			...grouped[key][0],
			important: grouped[key].map((s) => s.important).some(Boolean),
			type: uniq(grouped[key].map((s) => s.type)),
		};
	});
	return sortBy(merged, (s) => !s.important);
};
