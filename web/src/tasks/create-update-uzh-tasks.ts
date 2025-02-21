import xns from 'xns';
import {UPDATE_MODULE_UZH} from '../../../core/models/task-type';
import {insertTaskNative} from '../queue';
import {fetchList} from './fetch-uzh';

// The older modules have already been mapped to the newer modules so don't rerun the older modules
// -> Copy the production DB if you want to have the up-to-date modules
export const SEMESTERS = [
	// {
	// 	year: 2020,
	// 	semester: '003',
	// },
	// {
	// 	year: 2020,
	// 	semester: '004',
	// },
	// {
	// 	year: 2021,
	// 	semester: '003',
	// },
	// {
	// 	year: 2021,
	// 	semester: '004',
	// },
	// {
	// 	year: 2022,
	// 	semester: '003',
	// },
	// {
	// 	year: 2022,
	// 	semester: '004',
	// },
	// {
	// 	year: 2023,
	// 	semester: '003',
	// },
	// {
	// 	year: 2023,
	// 	semester: '004',
	// },
	{
		year: 2024,
		semester: '003',
	},
	{
		year: 2024,
		semester: '004',
	},
];

export const createUpdateUzhTasks = xns(async () => {
	let i = 0;
	for (const semester of SEMESTERS) {
		const {results} = await fetchList(6000, 0, {
			filter: {PiqYear: semester.year, PiqSession: semester.semester},
		});
		for (const module of results) {
			i++;
			await insertTaskNative(UPDATE_MODULE_UZH, {
				uni_identifier: module.Objid,
				semester: module.PiqSession,
				year: module.PiqYear,
			});
			console.log(i, 'inserted', module.Objid, module.SmStext);
		}
	}
});

