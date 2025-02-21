import {UZH} from '../../core/models/university';
import {moduleCollection} from '../../web/src/db/collections';

export const updateCoreArea = async () => {
	await moduleCollection().updateOne(
		{
			uni_identifier: '50942167',
			university: UZH,
		},
		{
			$set: {
				short_name: 'Core Area Media Reception & Media Effects',
			},
		}
	);
};
