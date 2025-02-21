import {AppState} from '../../../core/types/app-state';

export const getUserName = (state: AppState) => {
	return state.users.userProfile?.username;
};
