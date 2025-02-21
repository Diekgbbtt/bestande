import Module from '../../../core/models/module';
import {ExpandedPerson} from '../../../core/types/people-state';
import {RawPerson} from '../../../core/types/schedule';
import {moduleCollection} from '../db/collections';

export const expandPerson = async (
	personPreview: RawPerson
): Promise<ExpandedPerson> => {
	const rawResponsible = await moduleCollection()
		.find({
			university: personPreview.university,
			'semesters.responsible': personPreview.uni_identifier,
		})
		.toArray();
	const rawTeaching = await moduleCollection()
		.find({
			university: personPreview.university,
			'semesters.instructors.id': personPreview.uni_identifier,
		})
		.toArray();

	const personShouldBeRemoved = (r: Module) => {
		const filtered =
			r.uni_identifier === '50780596' &&
			personPreview.name.includes('Suzann-Viola Renninger') &&
			personPreview.university === 'UZH';
		return !filtered;
	};

	const responsible = rawResponsible.filter(personShouldBeRemoved);
	const teaching = rawTeaching.filter(personShouldBeRemoved);

	return {
		...personPreview,
		responsible,
		teaching,
	};
};
