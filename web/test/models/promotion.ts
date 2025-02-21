import {invalidEvent, validEvent} from '../../../core/test/demos/_promotion';
import validatePromotion from '../../src/helpers/validate-promotion';
import {test} from '../helpers/_test-with-context';

test('Promoted event by default should throw error', (t) => {
	// @ts-expect-error
	const errors = validatePromotion(invalidEvent);
	t.true(errors.length > 0);
});

test('Advanced promoted event should pass', (t) => {
	// @ts-expect-error
	const errors = validatePromotion(validEvent);
	t.is(errors.length, 0);
});

test('End date should be after start date', (t) => {
	const event = {
		promoter: 'Bestande',
		start_date: Date.now(),
		end_date: Date.now() - 100000,
		location: null,
	};
	// @ts-expect-error
	const errors = validatePromotion(event);
	t.truthy(errors.find((e) => e?.match(/vor der Startzeit/)));
});
