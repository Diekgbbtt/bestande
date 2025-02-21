import uniqBy from 'lodash/uniqBy';
import {getRandomUsername} from '../functions/generate-random-username';
import {User, UserState} from '../types/user-state';
import {ChatServerActions, LoadedPreviousMessages} from './chat-server';

const initialState: UserState = {
	userProfile: null,
	isGettingUserProfile: false,
	errorGettingProfile: null,
	usernameSuggestions: getRandomUsername(5),
	errorSettingUsername: null,
	isSettingUsername: false,
	otherUsers: [],
	uniqueUserId: null,
};

enum UserStateActions {
	START_GETTING_PROFILE = 'START_GETTING_PROFILE',
	SET_USER_PROFILE = 'SET_USER_PROFILE',
	ERROR_GETTING_PROFILE = 'ERROR_GETTING_PROFILE',
	START_SETTING_USERNAME = 'START_SETTING_USERNAME',
	USERNAME_SET = 'USERNAME_SET',
	ERROR_SETTING_USERNAME = 'ERROR_SETTING_USERNAME',
	SET_USER_PROFILES = 'SET_USER_PROFILES',
	UPDATE_AVATAR = 'UPDATE_AVATAR',
	AVATAR_CHANGED = 'AVATAR_CHANGED',
	REMOVE_AVATAR = 'REMOVE_AVATAR',
	AVATAR_REMOVED = 'AVATAR_REMOVED',
	SET_UNIQUE_USER_ID = 'SET_UNIQUE_USER_ID',
}

type UpdateAvatar = {
	type: UserStateActions.UPDATE_AVATAR;
	avatar: string;
};

export const updateAvatar = (avatar: string): UpdateAvatar => {
	return {
		type: UserStateActions.UPDATE_AVATAR,
		avatar,
	};
};

type StartGettingProfile = {
	type: UserStateActions.START_GETTING_PROFILE;
};

export const startGettingProfile = () => {
	return {
		type: UserStateActions.START_GETTING_PROFILE,
	};
};

type ErrorGettingProfile = {
	type: UserStateActions.ERROR_GETTING_PROFILE;
	error: Error;
};

export const errorGettingProfile = (error: Error) => {
	return {
		type: UserStateActions.ERROR_GETTING_PROFILE,
		error,
	};
};

type SetUserProfile = {
	type: UserStateActions.SET_USER_PROFILE;
	user: User;
};

export const setUserProfile = (user: User): SetUserProfile => {
	return {
		type: UserStateActions.SET_USER_PROFILE,
		user,
	};
};

type StartSettingUsername = {
	type: UserStateActions.START_SETTING_USERNAME;
};

export const startSettingUsername = (): StartSettingUsername => {
	return {
		type: UserStateActions.START_SETTING_USERNAME,
	};
};

type UsernameSet = {
	type: UserStateActions.USERNAME_SET;
	user: User;
};

export const userNameSet = (user: User): UsernameSet => {
	return {
		type: UserStateActions.USERNAME_SET,
		user,
	};
};

type ErrorSettingUsername = {
	type: UserStateActions.ERROR_SETTING_USERNAME;
	error: Error;
};

export const errorSettingUsername = (error: Error): ErrorSettingUsername => {
	return {
		type: UserStateActions.ERROR_SETTING_USERNAME,
		error,
	};
};

type SetUserProfiles = {
	type: UserStateActions.SET_USER_PROFILES;
	users: User[];
};

export const setUserProfiles = (_users: User[]): SetUserProfiles => {
	return {
		type: UserStateActions.SET_USER_PROFILES,
		users: _users,
	};
};

type AvatarChanged = {
	type: UserStateActions.AVATAR_CHANGED;
	userId: string;
	avatar: string;
};

export const avatarChanged = (
	userId: string,
	avatar: string
): AvatarChanged => {
	return {
		type: UserStateActions.AVATAR_CHANGED,
		userId,
		avatar,
	};
};

type RemoveAvatar = {
	type: UserStateActions.REMOVE_AVATAR;
};

export const removeAvatar = (): RemoveAvatar => {
	return {
		type: UserStateActions.REMOVE_AVATAR,
	};
};

type AvatarRemoved = {
	type: UserStateActions.AVATAR_REMOVED;
	userId: string;
};

export const avatarRemoved = (userId: string): AvatarRemoved => {
	return {
		type: UserStateActions.AVATAR_REMOVED,
		userId,
	};
};

type SetUniqueUserId = {
	type: UserStateActions.SET_UNIQUE_USER_ID;
	uniqueId: string;
};

export const setUniqueUserId = (uniqueId: string): SetUniqueUserId => {
	return {
		type: UserStateActions.SET_UNIQUE_USER_ID,
		uniqueId,
	};
};

export const users = (
	state: UserState = initialState,
	action:
		| StartGettingProfile
		| SetUserProfile
		| ErrorGettingProfile
		| StartSettingUsername
		| UsernameSet
		| ErrorSettingUsername
		| SetUserProfiles
		| LoadedPreviousMessages
		| UpdateAvatar
		| AvatarChanged
		| RemoveAvatar
		| AvatarRemoved
		| SetUniqueUserId
): UserState => {
	switch (action.type) {
		case UserStateActions.START_SETTING_USERNAME: {
			return {
				...state,
				isSettingUsername: true,
			};
		}

		case UserStateActions.USERNAME_SET: {
			return {
				...state,
				userProfile: action.user,
				errorSettingUsername: null,
				isSettingUsername: false,
			};
		}

		case UserStateActions.ERROR_SETTING_USERNAME: {
			return {
				...state,
				errorSettingUsername: action.error,
				isSettingUsername: false,
			};
		}

		case UserStateActions.START_GETTING_PROFILE: {
			return {
				...state,
				isGettingUserProfile: true,
				errorGettingProfile: null,
			};
		}

		case UserStateActions.SET_USER_PROFILE:
			return {
				...state,
				userProfile: action.user,
				isGettingUserProfile: false,
				errorGettingProfile: null,
			};
		case UserStateActions.ERROR_GETTING_PROFILE: {
			return {
				...state,
				errorGettingProfile: action.error,
				isGettingUserProfile: false,
			};
		}

		case UserStateActions.SET_USER_PROFILES:
			return {
				...state,
				otherUsers: uniqBy([...action.users, ...state.otherUsers], (u) => u.id),
			};
		case ChatServerActions.LOADED_PREVIOUS_MESSAGES:
			return {
				...state,
				otherUsers: uniqBy([...action.users, ...state.otherUsers], (u) => u.id),
			};
		case UserStateActions.UPDATE_AVATAR:
			return {
				...state,
				userProfile: state.userProfile
					? {
							...state.userProfile,
							avatar: action.avatar,
					  }
					: null,
			};
		case UserStateActions.AVATAR_CHANGED:
			return {
				...state,
				otherUsers: state.otherUsers.map((user) => {
					if (user.id === action.userId) {
						return {
							...user,
							avatar: action.avatar,
						};
					}

					return user;
				}),
			};
		case UserStateActions.REMOVE_AVATAR:
			return {
				...state,
				userProfile: state.userProfile
					? {
							...state.userProfile,
							avatar: null,
					  }
					: null,
			};
		case UserStateActions.AVATAR_REMOVED: {
			return {
				...state,
				otherUsers: state.otherUsers.map((user) => {
					if (user.id === action.userId) {
						return {
							...user,
							avatar: null,
						};
					}

					return user;
				}),
			};
		}

		case UserStateActions.SET_UNIQUE_USER_ID: {
			return {
				...state,
				uniqueUserId: action.uniqueId,
			};
		}

		default:
			return state;
	}
};
