import test from 'ava';
import {makeQuery} from '../../src/tasks/make-uzh-batch-payload-request';

test('Should make correct querystring', (t) => {
	const expected =
		'$skip=0&$top=20&$orderby=LastName%20asc&$filter=PiqYear%20eq%20%272016%27%20and%20PiqSession%20eq%20%27004%27&$inlinecount=allpage';
	const query = {
		skip: 0,
		top: 20,
		orderby: 'LastName asc',
		filter: {
			PiqYear: 2016,
			PiqSession: '004',
		},
		inlinecount: 'allpage',
	};
	t.is(expected, makeQuery(query));
});
