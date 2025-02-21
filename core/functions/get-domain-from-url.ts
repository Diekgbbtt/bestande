import {parse} from 'url';
import {immutableReverse} from './immutable-reverse';

export const getDomainFromUrl = (str: string) => {
	const parsed = parse(str);
	if (!parsed.hostname) {
		return '';
	}

	const split = parsed.hostname.split('.');
	return immutableReverse(immutableReverse(split).slice(0, 2)).join('.');
};
