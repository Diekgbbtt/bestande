import {periodToNumber} from '../../../core/functions/uzh-period';
import {SWISS_HALF_GRADES} from '../../../core/models/grading';
import {UZH} from '../../../core/models/university';
import {addSemester} from '../../src/db/add-semester';

const semester1 = {
	period: periodToNumber('2016', '004'),
	registration_start: new Date(),
	registration_end: new Date(),
	cancellation_start: new Date(),
	cancellation_end: new Date(),
	grading: SWISS_HALF_GRADES,
	credits: 6.0,
};

const mod1 = {
	university: UZH,
	uni_identifier: '50430354',
	name: 'Introduction to Game Theory',
	short_name: 'Game Theory',
};

const semester2 = {
	period: periodToNumber('2016', '003'),
	registration_start: new Date(),
	registration_end: new Date(),
	cancellation_start: new Date(),
	cancellation_end: new Date(),
	grading: SWISS_HALF_GRADES,
	credits: 6.0,
};

const mod2 = {
	university: UZH,
	uni_identifier: '50430355',
	name: 'Auditing',
	short_name: 'Audit',
};

export const addDemoModule = (params = {}, modParams = {}) => {
	// Clone default module, because it gets mutated in db/mongo.js
	return Promise.all([
		// @ts-expect-error
		addSemester({...mod1, ...modParams}, {...semester1, ...params}),
		addSemester(
			// @ts-expect-error
			{...mod2, ...modParams},
			{...semester2, ...params}
		),
	]);
};
