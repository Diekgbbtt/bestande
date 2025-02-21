import test from 'ava';
import getPermutations from '../../../core/functions/alternative-writings';

test('Should return array with inital element if no alternatives', (t) => {
	const input = 'Game Theory';
	t.deepEqual([input], getPermutations(input));
});

test('Should permutate roman numerals', (t) => {
	const input = 'ABC I';
	t.deepEqual(['ABC 1', 'ABC i'], getPermutations(input));
});

test('Should permutate names', (t) => {
	const input = 'Makro';
	t.deepEqual(['makro', 'makroökonomik'], getPermutations(input));
});

test('Should permutate names and roman numerals', (t) => {
	const input = 'BWL 2 (V+Ü)';
	t.deepEqual(
		[
			'bwl 2 (V+Ü)',
			'bwl ii (V+Ü)',
			'betriebswirtschaftslehre 2 (V+Ü)',
			'betriebswirtschaftslehre ii (V+Ü)',
		],
		getPermutations(input)
	);
});
