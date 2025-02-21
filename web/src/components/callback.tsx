import {signInWithEmailLink} from 'firebase/auth';
import React, {useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {auth} from '../firebase-frontend';

const CallbackPage: React.FC = () => {
	const history = useHistory();

	const currentURL = new URL(window.location.href);
	const path = currentURL.pathname;
	const parts = path.split('/');
	const rawEmail = parts[2] || '';
	const extractedEmail = rawEmail.split('?')[0];

	useEffect(() => {
		if (!extractedEmail) {
			history.push('/profile');
			return;
		}

		signInWithEmailLink(auth, extractedEmail, window.location.href)
			.then((result) => {
				history.push('/profile');
			})
			.catch((error) => {
				console.error('Error signing in with email link', error);
				history.push('/profile');
			});
	}, []);

	return <></>;
};

export default CallbackPage;
