import admin from 'firebase-admin';
import {FirebaseOptions} from 'firebase/app';
import {hashEmail} from './hashing/hashing-functions';
import {verify} from 'jsonwebtoken';
import {CustomJwtPayload} from './api/students/me';

const firebaseConfig: FirebaseOptions = {
	apiKey: 'AIzaSyCzNaVZnGA6WzW0gkBAgcIixlHc3LEkRWM',
	projectId: 'bestande-uzh',
};

admin.initializeApp(firebaseConfig);

const extractBearerToken = (req) => {
	const authHeader = req.headers.authorization || '';
	if (!authHeader.toLowerCase().startsWith('bearer ')) {
		throw new Error('No Bearer token found');
	}
	return authHeader.split(' ')[1];
};

const getEmailFromIDToken = async (token: string): Promise<string> => {
	try {
		const decodedToken = await admin.auth().verifyIdToken(token);
		const email = decodedToken.email;
		if (!email) {
			throw new Error('No email found in token');
		}
		if (!email.toLowerCase().endsWith('@uzh.ch')) {
			throw new Error('Not a UZH email address');
		}
		return email;
	} catch (error) {
		console.error('Invalid ID token', error);
		throw error;
	}
};

// The reason for having two separate methods: When only the hashed email is needed we never have a variable of the actual email anywhere in the backend. So the backend won't even know the email of the user making the request. But for certain endpoints we need the email in plain form (e.g. /me) so we have a separate method for that.

export const getEmailFromEduId = async (req) => {
	// const oidcObject = req // JSON.parse(`${localStorage.getItem("oidc.user:https://login.eduid.ch/:bestande_test_eduid")}`)

	return await fetch('https://login.eduid.ch/idp/profile/oidc/userinfo', {
		method: 'get',
		headers: new Headers({
			Authorization: 'Bearer ' + req.header('access_token'),
			'Content-Type': 'application/json',
		}),
	})
		.then((response) => {
			if (!response.ok) {
				// Don't forget this part!
				throw new Error(`HTTP error ${response.status}`);
			}

			console.log('Got Email from eduId!');

			return response.json();
		})
		.then(function (data) {
			// {
			//   sub: '...',
			//   swissEduPersonUniqueID: '123456789@eduid.ch',
			//   email_verified: true,
			//   swissEduIDLinkedAffiliationMail: [ 'max.muster@uzh.ch' ],
			//   name: 'Max Muster',
			//   given_name: 'Max',
			//   family_name: 'Muster',
			//   email: '...@gmail.com',
			//   swissEduIDLinkedAffiliation: [ 'member@uzh.ch', 'student@uzh.ch', 'staff@uzh.ch' ]
			// }
			return data.swissEduIDLinkedAffiliationMail[0];
		});
};

export const getJwtSecretKey = () => {
	const jwtSecretKey = process.env.JWT_SECRET_KEY;
	if (!jwtSecretKey && process.env.NODE_ENV === 'development') {
		return 'DEV_JWT_SECRET_KEY';
	}
	if (!jwtSecretKey) {
		throw new Error(
			'JWT secret key is not defined in a non development environment'
		);
	}
	return jwtSecretKey;
};

const getEmailFromOurOwnAccessToken = async (req): Promise<string> => {
	const token = (req as any).cookies['accessToken'];
	if (!token) {
		throw new Error('No access token found');
	}

	const JWT_SECRET_KEY = getJwtSecretKey();

	try {
		const payload = verify(token, JWT_SECRET_KEY) as CustomJwtPayload;
		if (!payload.email) {
			throw new Error('No email found in token');
		}
		return payload.email;
	} catch (err) {
		throw new Error('Invalid access token');
	}
};

// This function is only used once to verify that the user has logged in with EduID. And then we give out our own access token.
export const getEmailFromExternalSource = getEmailFromEduId;

//Those functions are mainly used when the user/student needs to be authenticated.
export const getEmailFromRequest = getEmailFromOurOwnAccessToken;

export const getHashedEmailFromRequest = async (req) => {
	const email = await getEmailFromRequest(req);
	return hashEmail(email);
};
