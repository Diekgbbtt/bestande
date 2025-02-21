import React, {useState} from 'react';
import {Input} from './forms/input';
import Button from './button';
import {sendPasswordResetEmail} from 'firebase/auth';
import {auth} from '../firebase-frontend';
import {useHistory} from 'react-router';

const ResetPassword: React.FC = () => {
	const [email, setEmail] = useState('');
	const history = useHistory();

	const resetPassword = async (e) => {
		e.preventDefault();
		if (!email.toLowerCase().endsWith('@uzh.ch')) {
			const event = new CustomEvent('showBanner', {
				detail: {
					message: 'Gib bitte deine UZH Email Adresse ein',
					type: 'error',
				},
			});
			window.dispatchEvent(event);
			return;
		}
		sendPasswordResetEmail(auth, email)
			.then(() => {
				const successEmail = new CustomEvent('showBanner', {
					detail: {
						message: `Du hast nun eine Email um dein Passwort zurückzusetzen bekommen\nÜberprüfe auch deinen Spam Ordner!`,
						type: 'success',
					},
				});
				window.dispatchEvent(successEmail);
				history.push('/login');
			})
			.catch((error) => {
				const errorEmail = new CustomEvent('showBanner', {
					detail: {
						message: error,
						type: 'error',
					},
				});
				window.dispatchEvent(errorEmail);
			});
	};

	return (
		<div style={{display: 'flex', justifyContent: 'center'}}>
			<div
				style={{
					maxWidth: 500,
					padding: 20,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<h2 style={{margin: 0}}>Passwort zurücksetzen: </h2>
				<form
					style={{
						margin: '20px 0px',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						width: '100%',
						gap: 5,
					}}
					onSubmit={resetPassword}
				>
					<Input
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Deine UZH Email"
					/>

					<Button type="submit">Passwort zurücksetzen</Button>
				</form>
			</div>
		</div>
	);
};

export default ResetPassword;
