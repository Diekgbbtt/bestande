import {mapToUniSlug} from '../functions/uni-slug';
import {ExpandedPerson} from '../types/people-state';
import {RawPerson} from '../types/schedule';
import {ETH} from './university';

export const getNameWithoutTitle = (
	person: RawPerson | ExpandedPerson
): string => {
	if (person.university === ETH) {
		return person.name as string;
	}

	return person.first_name + ' ' + person.last_name;
};

export const personGetUrl = (person: RawPerson | ExpandedPerson) => {
	return `/${mapToUniSlug(person.university)}/person/${person.uni_identifier}`;
};
