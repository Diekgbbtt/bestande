import test from 'ava';
import {Config} from '../../core/data/Config';

test('Feature flags correct', (t) => {
	t.is(Config.DEPRECATE_ITALIAN, true);
	t.is(Config.COURSE_SYNC, false);
});
