import {peopleCollection} from '../../web/src/db/collections';

export const deletePerson = async () => {
	await peopleCollection().deleteOne({
		uni_identifier: '01092754',
		university: 'UZH',
	});
};
