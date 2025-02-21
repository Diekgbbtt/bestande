import {Institution} from '../../../core/models/credit';
import {RawPerson} from '../../../core/types/schedule';
import {peopleCollection} from './collections';
import {connectToMongo} from './modern';

export const getManyPeople = async (
	university: Institution,
	ids: string[]
): Promise<RawPerson[]> => {
	await connectToMongo();
	return peopleCollection()
		.find({
			university,
			uni_identifier: {
				$in: ids,
			},
		})
		.toArray();
};
