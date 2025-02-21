import {AppLanguage} from '../models/app-language';
import {Device} from '../types/notifications-state';
import {User} from '../types/user-state';

export type DatabaseUser = User & {
	token: string;
	devices: Device[];
	pushSubscriptions: string[];
	latestAppVersion: string;
	preferredLanguage: AppLanguage;
	sentProfilePictureReminder?: number;
	sentBestande420Update?: number;
	sentCoronaVirusUpdate?: number;
	sentHS20Update?: number;
	sentBooksUpdate?: number;
	sentSpring21BooksUpdate?: number;
	moduleCollectionNonce: number;
};

export type SetUsernamePayload = {
	token: string;
	username: string;
	appVersion: string;
	language: AppLanguage;
};

export type GetProfileRequest = {
	token: string;
	appVersion: string;
	language: AppLanguage;
};
