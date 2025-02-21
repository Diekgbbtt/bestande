import Module from '../../../core/models/module';
import {test} from '../helpers/_test-with-context';

test('Module should sort semesters correctly', (t) => {
	const data = {
		semesters: [
			{
				period: 201601,
			},
			{
				period: 201502,
			},
			{
				period: 201602,
			},
		],
	};
	// @ts-expect-error
	const module = new Module(data);
	t.is(module.semesters[0].period_human, 'HS16');
	t.is(module.semesters[1].period_human, 'FS16');
	t.is(module.semesters[2].period_human, 'HS15');
});
