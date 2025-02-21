import xns from 'xns';
import {fetchList, fetchModule} from './fetch-uzh';
import {updateUzhModuleInDb} from './update-uzh-module';

const SEMESTERS = [
	{
		year: 2018,
		semester: '004',
	},
	{
		year: 2018,
		semester: '003',
	},
];

xns(async () => {
	let i = 0;
	for (const semester of SEMESTERS) {
		const {results} = await fetchList(6000, 0, {
			filter: {PiqYear: semester.year, PiqSession: semester.semester},
		});
		for (const mod of results) {
			i++;
			const module = await fetchModule(
				mod.Objid,
				mod.PiqYear,
				mod.PiqSession,
				'en'
			);
			const deJson = await fetchModule(
				mod.Objid,
				mod.PiqYear,
				mod.PiqSession,
				'de'
			);
			await updateUzhModuleInDb(module, deJson);

			console.log(i, 'inserted', mod.Objid);
		}
	}
});
