import xns from 'xns';
import {connectToMongo} from '../web/src/db/modern';
import {SEMESTERS} from '../web/src/tasks/create-update-uzh-tasks';
import {fetchList} from '../web/src/tasks/fetch-uzh';
import updateUzhModule from '../web/src/tasks/update-uzh-module';
require('dotenv').config();

xns(async () => {
	let i = 0;
	await connectToMongo();
	for (const semester of SEMESTERS) {
		const {results} = await fetchList(6000, 0, {
			filter: {PiqYear: semester.year, PiqSession: semester.semester},
		});
		for (const module of results) {
			i++;
			await updateUzhModule({
				attrs: {
					data: {
						uni_identifier: module.Objid,
						semester: module.PiqSession,
						year: module.PiqYear,
					},
				},
			});
			console.log(i, 'inserted', module.Objid, module.SmStext);
		}
	}
});
