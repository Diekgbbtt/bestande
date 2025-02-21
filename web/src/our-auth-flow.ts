import {AuthContextProps} from 'react-oidc-context';

export const isStudentStillLoggedIn = (): boolean => {
	const accessTokenValidUntilString = localStorage.getItem(
		'accessTokenValidUntil'
	);
	if (!accessTokenValidUntilString) {
		return false;
	}
	const accessTokenValidUntil = parseInt(accessTokenValidUntilString);
	if (accessTokenValidUntil < Date.now()) {
		return false;
	}
	return true;
};

export const obtainAccessTokenFromOurBackend = async (
	auth: AuthContextProps
): Promise<void> => {
	const localStorageKey = `oidc.user:https://login.eduid.ch/:${process.env.REACT_APP_OIDC_CLIENT_ID}`;
	const oidcObject = JSON.parse(`${localStorage.getItem(localStorageKey)}`);
	const idToken = oidcObject?.access_token;
	if (!idToken) {
		console.error('No external idToken found');
	}
	try {
		const response = await fetch('/api/me/accessToken', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				Authorization: `Bearer ${idToken}`,
				access_token: idToken,
			},
			credentials: 'include',
		});
		const json = await response.json();
		if (!json.success) {
			throw new Error(json.error);
		}
		const accessTokenValidUntil = json.data.accessTokenValidUntil;
		localStorage.setItem(
			'accessTokenValidUntil',
			accessTokenValidUntil.toString()
		);
		//We can now logout from Switch Edu ID since we have our own access token as an http only cookie
		auth.signoutSilent();
	} catch (e) {
		console.error(e);
	}
};

export const logoutStudent = async (auth: AuthContextProps): Promise<void> => {
	localStorage.removeItem('accessTokenValidUntil');
	try {
		auth.signoutSilent();
	} catch (e) {
		console.error(e);
	}
	try {
		await fetch('/api/me/removeAccessToken', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			credentials: 'include',
		});
	} catch (e) {
		console.error(e);
	}
};
