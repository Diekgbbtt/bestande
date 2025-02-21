import xns from 'xns';
import {periodToNumber} from '../../../core/functions/uzh-period';
import {UZH} from '../../../core/models/university';
import {UzhApiResponse} from '../../../core/types/types';
import {addSemester} from '../db/add-semester';
import {
	eventCollection,
	moduleCacheCollection,
	peopleCollection,
} from '../db/collections';
import {connectToMongo} from '../db/modern';
import {parseExam} from '../helpers/parse-exam';
import {fetchModule} from './fetch-uzh';
import {
	makeModuleFromJson,
	makePeopleFromJson,
	makeSemesterFromJson,
} from './uzh-converter';

const cacheUzhModule = async (
	data: {
		uni_identifier: string;
		year: string;
		semester: string;
	},
	module: UzhApiResponse<any>
) => {
	const {uni_identifier, year, semester} = data;
	const obj = {
		uni_identifier,
		year,
		semester,
	};
	return moduleCacheCollection().update(obj, Object.assign(obj, {module}), {
		upsert: true,
	});
};

export const updateUzhModuleInDb = async (json: any, germanJson: any) => {
	const people = makePeopleFromJson(json);
	// Module 50781544 has over 200 people
	// Lets limit amount of people
	for (const person of people.slice(0, 20)) {
		await peopleCollection().updateOne(
			{
				uni_identifier: person.uni_identifier,
				university: person.university,
			},
			{
				$set: person,
			},
			{upsert: true}
		);
	}

	const period = periodToNumber(json.PiqYear, json.PiqSession);

	const examParsed = parseExam({
		string: json.TestsDescription,
		uni_identifier: json.SmObjId,
		period,
		university: UZH,
	});

	if (examParsed) {
		await Promise.all(
			examParsed.events.map((e) => {
				return eventCollection().updateOne(
					{
						id: e.id,
						event_serie_id: e.event_serie_id,
						university: e.university,
					},
					{
						$set: e,
					},
					{
						upsert: true,
					}
				);
			})
		);
	}

	/*
		e.g. this module:
		"uni_identifier" : "50886025",
		"semester" : "004",
		"year" : "2017"
		is a null module, let's leave it out
	*/
	if (json.SmObjId === '00000000') {
		return null;
	}

	return addSemester(
		makeModuleFromJson(json, germanJson),
		makeSemesterFromJson(json)
	);
};

const updateUzhModule = xns(
	async (
		job = {
			attrs: {
				data: {
					uni_identifier: '51016530',
					year: '2020',
					semester: '003',
				},
			},
		}
	) => {
		await connectToMongo();
		const {uni_identifier, year, semester} = job.attrs.data;
		const [module, germanJson] = await Promise.all([
			fetchModule(uni_identifier, year, semester, 'en'),
			fetchModule(uni_identifier, year, semester, 'de'),
		]);
		await cacheUzhModule(job.attrs.data, module);
		return updateUzhModuleInDb(module, germanJson);
	}
);

export default updateUzhModule;
