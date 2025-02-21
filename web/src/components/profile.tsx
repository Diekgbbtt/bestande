import React, {useEffect, useState} from 'react';
import {apiRequest} from '../../../core/functions/api-request';

import {StudentDto} from '../api/dto/student.dto';
import ProfileSignedIn from './profile-signedIn';
import {useHistory} from 'react-router';
import {logoutStudent} from '../our-auth-flow';
import {useAuth} from 'react-oidc-context';

const Profile: React.FC = () => {
	const [email, setEmail] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [student, setStudent] = useState<StudentDto>({email: '', username: ''});
	const history = useHistory();
	const auth = useAuth();

	const changeUsername = async (username: string) => {
		try {
			const student: StudentDto = await apiRequest('/me', {
				method: 'PUT',
				body: JSON.stringify({username}),
			});
			setStudent(student);
			const usernameChanged = new CustomEvent('showBanner', {
				detail: {
					message: 'Dein Username wurde erfolgreich geändert.',
					type: 'success',
				},
			});
			window.dispatchEvent(usernameChanged);
		} catch (e) {
			console.error('Error changing username:', e);
			const usernameError = new CustomEvent('showBanner', {
				detail: {
					message: 'Es gab ein Fehler bei der Änderung deines Usernames',
					type: 'error',
				},
			});
			window.dispatchEvent(usernameError);
		}
	};

	useEffect(() => {
		async function loadUserProfile() {
			setLoading(true);
			try {
				const student: StudentDto = await apiRequest('/me', {
					method: 'GET',
				});
				setEmail(student.email);
				setStudent(student);
			} catch (e) {
				console.error('Error fetching user email:', e);
				setEmail(null);
				await logoutStudent(auth);
				history.push('/login');
			} finally {
				setLoading(false);
			}
		}
		loadUserProfile();
	}, []);

	const logout = async () => {
		await logoutStudent(auth);
		history.push('/login');
	};

	return (
		<div style={{display: 'flex', justifyContent: 'center'}}>
			<div
				style={{
					padding: 20,
					maxWidth: 700,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				{loading ? (
					<p>Lade...</p>
				) : email ? (
					<ProfileSignedIn
						student={student}
						changeUsername={changeUsername}
						logout={logout}
					></ProfileSignedIn>
				) : (
					<p>
						Du bist nicht angemeldet, drücke
						<a style={{color: 'blue'}} href="/login">
							{' '}
							hier
						</a>{' '}
						um dich einzuloggen.
					</p>
				)}
			</div>
		</div>
	);
};

export default Profile;
