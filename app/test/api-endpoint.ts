import test from 'ava';
import {getDomainForOS, getWsDomainForOS} from '../../core/models/domain';

test('Should not commit dev URL by accident', (t) => {
	t.is(getDomainForOS('ios'), 'https://api.bestande.ch');
	t.is(getWsDomainForOS('android'), 'https://api.bestande.ch');
});
