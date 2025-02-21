import test from 'ava';
import {periodToString} from '../../../core/functions/uzh-period';
import {currentPeriod} from '../../../core/models/current-period';
import {getPeriodForDate} from '../../src/components/get-period-for-date';

test('We are in current period', (t) => {
	t.is(getPeriodForDate(new Date()), currentPeriod);
});

test('21.1.2020 is HS19', (t) => {
	t.is(
		periodToString(getPeriodForDate(new Date(2020, 0, 21, 0, 0, 0, 0))),
		'HS19'
	);
});

test('21.2.2020 is FS20', (t) => {
	t.is(
		periodToString(getPeriodForDate(new Date(2020, 1, 21, 0, 0, 0, 0))),
		'FS20'
	);
});

test('1.8.2020 is HS20', (t) => {
	t.is(
		periodToString(getPeriodForDate(new Date(2020, 8, 1, 0, 0, 0, 0))),
		'HS20'
	);
});
