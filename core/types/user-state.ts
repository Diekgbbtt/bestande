export type User = {
	username: string;
	id: string;
	avatar: string | null;
	joined: number;
	lastUsernameChange: number;
	admin: boolean;
	verified?: boolean;
};

export type UserState = {
	userProfile: User | null;
	otherUsers: User[];
	isGettingUserProfile: boolean;
	errorGettingProfile: Error | null;
	usernameSuggestions: string[];
	errorSettingUsername: Error | null;
	isSettingUsername: boolean;
	uniqueUserId: string | null;
};
