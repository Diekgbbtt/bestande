import test from 'ava';
import validatePeriod, {
	nextPeriod,
	previousPeriod,
} from '../../../core/functions/validate-period';
import {currentPeriod} from '../../../core/models/current-period';
import {UZH} from '../../../core/models/university';

test('Should validate periods correctly', (t) => {
	t.true(validatePeriod(UZH, 20171));
	t.true(validatePeriod(UZH, 20211));
	t.false(validatePeriod(UZH, 20209));
	t.false(validatePeriod(UZH, 201));
	// @ts-expect-error
	t.false(validatePeriod('abc', 20172));
	t.true(validatePeriod(UZH, currentPeriod));
});

test('Should calculate previous period corrrectly', (t) => {
	t.is(previousPeriod(20171), 20162);
	t.is(previousPeriod(20172), 20171);
});

test('Should calculate next period corrrectly', (t) => {
	t.is(nextPeriod(20172), 20181);
	t.is(nextPeriod(20171), 20172);
});
