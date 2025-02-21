import {instituteRegex} from '../../src/helpers/institute-regex';
import {test} from '../helpers/_test-with-context';

test('Institute regex should cover all universities', (t) => {
	t.is(instituteRegex(), '(uzh|eth)');
});
