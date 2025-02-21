import ethMensa from '../data/eth-mensa';
import uzhMensa from '../data/uzh-mensa';
import {Institution} from '../models/credit';
import {ETH, UZH} from '../models/university';
import {MensaApiResponse} from '../types/food';

export const getInstitutionOfMensa = (
	m: MensaApiResponse
): Institution | null => {
	for (const canteen of uzhMensa) {
		for (const canteenMensa of canteen.mensa) {
			if (m.slug === canteenMensa.slug) {
				return UZH;
			}
		}
	}

	for (const canteen of ethMensa) {
		for (const canteenMensa of canteen.mensa) {
			if (m.slug === canteenMensa.slug) {
				return ETH;
			}
		}
	}

	return null;
};
