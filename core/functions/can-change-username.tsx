import ms from 'ms';
import {User} from '../types/user-state';

export const canChangeUsername = (user: User | null) => {
	// If there has not yet been a username set we will not show the restriction
	if (!user) {
		return true;
	}

	if (Date.now() - user.lastUsernameChange < ms('12h')) {
		return false;
	}

	return true;
};
