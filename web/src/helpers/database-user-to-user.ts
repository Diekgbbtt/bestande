import {DatabaseUser} from '../../../core/actions/users';
import {User} from '../../../core/types/user-state';

export const databaseUserToUser = (user: DatabaseUser): User => {
	const {
		token,
		devices,
		pushSubscriptions,
		latestAppVersion,
		sentProfilePictureReminder,
		sentBestande420Update,
		sentHS20Update,
		sentBooksUpdate,
		sentSpring21BooksUpdate,
		sentCoronaVirusUpdate,
		preferredLanguage,
		moduleCollectionNonce,
		...restOfUser
	} = user;
	return restOfUser;
};
