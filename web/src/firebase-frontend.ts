import {FirebaseApp, FirebaseOptions, initializeApp} from 'firebase/app';
import {
	browserLocalPersistence,
	getAuth,
	getIdToken,
	onAuthStateChanged,
} from 'firebase/auth';
import {authEvents} from './auth.events';

const firebaseConfig: FirebaseOptions = {
	apiKey: 'AIzaSyCzNaVZnGA6WzW0gkBAgcIixlHc3LEkRWM',
	authDomain: 'bestande-uzh.firebaseapp.com',
	projectId: 'bestande-uzh',
	storageBucket: 'bestande-uzh.appspot.com',
	messagingSenderId: '737901600171',
	appId: '1:737901600171:web:c3fd17eddc5c20087d46ee',
	measurementId: 'G-MYTJDFWEE5',
};

const firebaseName = 'Bestande';
const app: FirebaseApp = initializeApp(firebaseConfig, firebaseName);

const auth = getAuth(app);
auth.setPersistence(browserLocalPersistence);

export const fetchIdToken = async (): Promise<string | null> => {
	return new Promise((resolve, reject) => {
		onAuthStateChanged(auth, async (user) => {
			if (user?.emailVerified) {
				try {
					const token = await getIdToken(user);
					resolve(token);
				} catch (e) {
					console.error('Error fetching IdToken:', e);
					resolve(null);
				}
			} else {
				console.log('No user logged in');
				resolve(null);
			}
		});
	});
};

export const isLoggedIn = async (): Promise<boolean> => {
	const token = await fetchIdToken();
	return token !== null;
};

export {auth};
