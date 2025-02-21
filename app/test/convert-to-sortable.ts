import test from 'ava';
import {sortableIdentifier} from '../../core/functions/sortable-identifier';

test('Convert roman numerals to sortable', (t) => {
	t.is(sortableIdentifier('III'), '0000000003');
	t.is(sortableIdentifier('V'), '0000000005');
	t.is(sortableIdentifier('123'), '0000000123');
	t.is(sortableIdentifier('123.1'), '0000000123.1');
	t.is(sortableIdentifier('abc'), 'abc');
	t.is(sortableIdentifier(''), '0000000000');
});
