export type LoginState = {
	loggedIn: boolean;
	loading: boolean;
	progress: null | string;
	username: string;
	error: string | null;
	lastUpdate: number;
};
