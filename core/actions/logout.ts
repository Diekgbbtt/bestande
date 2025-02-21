// WArning RN dependency

import {CreditCache} from '../functions/CreditCache';
import {getUserHash} from '../functions/get-user-hash';
import {Institution} from '../models/credit';
import {
	didLogOut,
	DidLogOutAction,
	setUsername,
	SetUserNameAction,
} from './login';
import {fetchRatings} from './ratings';

export function doLogout(institution: Institution) {
	return async (dispatch: {
		(arg0: DidLogOutAction): void;
		(arg0: SetUserNameAction): void;
		(arg0: any): void;
	}) => {
		dispatch(didLogOut(institution));
		dispatch(setUsername('', institution));
		dispatch(fetchRatings(getUserHash(null, null), institution));
		await CreditCache.clear(institution);
	};
}
