import {Institution} from '../models/credit';
import {ETH, UZH} from '../models/university';

export const mapToUniSlug = (university: Institution): string => {
	switch (university) {
		case UZH:
			return 'uzh';
		case ETH:
			return 'eth';
		default:
			throw new Error('Unknown institute ' + university);
	}
};

export const mapToUniversity = (uniSlug: string): Institution => {
	switch (uniSlug) {
		case 'uzh':
			return UZH;
		case 'eth':
			return ETH;
		default:
			throw new Error('Unknown uni slug');
	}
};
