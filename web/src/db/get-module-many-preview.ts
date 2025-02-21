import {Institution} from '../../../core/models/credit';
import {ModulePreview} from '../../../core/models/module';
import {moduleCollection} from './collections';
import {connectToMongo} from './modern';

export const getModuleManyPreview = async (
	university: Institution,
	identifiers: string[]
): Promise<ModulePreview[]> => {
	await connectToMongo();
	return (moduleCollection()
		.find(
			{
				university,
				uni_identifier: {$in: identifiers},
			},
			{
				projection: {
					university: 1,
					name: 1,
					short_name: 1,
					uni_identifier: 1,
					userCount: 1,
					type: 1,
					ratingSummary: 1,
					gradeStatistics: 1,
					faculty: 1,
					'semesters.period': 1,
					'semesters.credits': 1,
				},
			}
		)
		.toArray() as unknown) as Promise<ModulePreview[]>;
};
