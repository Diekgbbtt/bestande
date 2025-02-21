import {Credit, CustomModule, Institution} from '../models/credit';
import {ETH} from '../models/university';

export const getUniqueIdentifier = (
	item: Credit | CustomModule,
	stripHash = false
): string => {
	// @ts-expect-error
	if (item?.custom) {
		// @ts-expect-error
		return item._id;
	}

	if ((item as any).link) {
		const index = (item as Credit).link?.indexOf('#');
		if (!stripHash || index === -1) {
			return (item as Credit).link as string;
		}

		return (item as Credit).link?.substr(0, index) as string;
	}

	if ((item as CustomModule).university) {
		return String(item.university) + String(item.uni_identifier) + item.period;
	}

	if ((item as any).institution && (item as Credit).institution === ETH) {
		return (
			((item as Credit).institution as Institution) +
			item.uni_identifier +
			item.period
		);
	}

	return (
		item.name +
		(item as any).module +
		((item as any).status === 'FAILED' ? '-failed' : '')
	);
};
