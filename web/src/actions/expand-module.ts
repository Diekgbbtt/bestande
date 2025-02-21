import flatten from 'lodash/flatten';
import flattenDeep from 'lodash/flattenDeep';
import uniq from 'lodash/uniq';
import {truthy} from '../../../core/functions/truthy';
import Module, {ModulePreview} from '../../../core/models/module';
import Semester from '../../../core/models/semester';
import {EventSerieType, RawPerson} from '../../../core/types/schedule';
import {ratingsCollection} from '../db/collections';
import {getManyPeople} from '../db/get-many-people';
import {getModuleManyPreview} from '../db/get-module-many-preview';

export const expandModule = async (mod: Module): Promise<Module> => {
	const people: string[] = uniq<string>(
		flatten(
			[
				flatten(mod.semesters.map((s) => s.responsible as string[])),
				flatten(mod.semesters.map((s) => s.instructors.map((i) => i.id))),
				flatten(
					mod.semesters
						.map(
							(s) =>
								s.assessment &&
								flatten(
									s.assessment.map((a) =>
										(a.examiners || []).map((e) => e.id)
									)
								)
						)
						.filter(truthy)
				),
			].filter(truthy)
		)
	).filter(truthy);

	const combinations = flatten(
		flattenDeep(
			mod.semesters.map((s) => (s.assessment ?? []).map((a) => a.combination))
		)
	);
	const moduleIds: string[] = uniq(
		combinations.filter(truthy).map((m: any) => m.uni_identifier)
	);

	const [dbPeople, modules]: [RawPerson[], ModulePreview[]] = await Promise.all([
		getManyPeople(mod.university, people as string[]),
		getModuleManyPreview(mod.university, moduleIds),
	]);

	const mappedSemesters = mod.semesters.map(
		(s: Semester): Semester =>
			new Semester({
				...s,
				event_series: s.event_series as EventSerieType[],
				responsible: (s.responsible as string[])
					.map((r: string) => dbPeople.find((p) => r === p.uni_identifier))
					.filter(truthy),
				instructors: s.instructors.map((other) => ({
					...other,
					instructor: dbPeople.find((p) => other.id === p.uni_identifier),
				})),
				assessment: s.assessment
					? s.assessment
							.map((variant) => {
								return {
									...variant,
									combination: variant.combination
										? variant.combination
												.map((c) => {
													return modules.find(
														(m) =>
															m.uni_identifier ===
															c.uni_identifier
													);
												})
												.filter(truthy)
										: [],
									examiners: variant.examiners
										? variant.examiners.map((e) => {
												return {
													...e,
													person: dbPeople.find(
														(p) =>
															e.id === p.uni_identifier
													),
												};
										  })
										: [],
								};
							})
							.filter(truthy)
					: null,
			})
	);
	const serverModule = new Module({
		...mod,
		semesters: mappedSemesters,
	});

	const match = {
		university: mod.university,
		uni_identifier: mod.uni_identifier,
	};

	const [avg, total] = await Promise.all([
		ratingsCollection()
			.aggregate([
				{
					$match: match,
				},
				{
					$group: {_id: '$objectId', average: {$avg: '$score'}},
				},
			])
			.toArray(),
		ratingsCollection().countDocuments(match),
	]);
	const average = (avg as unknown) as {average: number}[];
	serverModule.ratingSummary.total = total;
	serverModule.ratingSummary.average = average[0]?.average ?? null;
	return serverModule;
};
