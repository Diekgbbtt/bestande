import {createSelector} from 'reselect';
import {AppState} from '../types/app-state';
import {User} from '../types/user-state';

export const hasGodmodeAccess = createSelector(
	[(state: AppState) => state.users.userProfile],
	(userProfile: User): boolean => {
		return userProfile?.admin;
	}
);
