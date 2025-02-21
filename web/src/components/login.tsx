import React, {useEffect, useState} from 'react';

import {useHistory} from 'react-router';
import {useAuth} from 'react-oidc-context';
import {Footer} from './footer';

import styled from 'styled-components';
import {
	isStudentStillLoggedIn,
	obtainAccessTokenFromOurBackend,
} from '../our-auth-flow';

const StyledInput = styled.input`
	max-width: 150px;

	&:hover {
		opacity: 0.8;
	}
`;

const Login: React.FC = () => {
	const [loading, setLoading] = useState(false);

	const history = useHistory();
	const auth = useAuth();
	const [loginAttempts, setLoginAttempts] = useState(0);

	if (isStudentStillLoggedIn()) {
		// "isStudentStillLoggedIn" is only determined based on the local storage "accessTokenValidUntil" -> if this is for some reason wrong we go the the profile page, which makes an API call to /me -> if this fails the user will be properly logged out and we land here again where the user can try to login again
		history.push('/profile');
	}

	useEffect(() => {
		const obtainOurAccessTokenAndRedirect = async () => {
			try {
				setLoading(true);
				await obtainAccessTokenFromOurBackend(auth);
				setLoading(false);
				history.push('/profile');
				//window.open("/profile","_self") // force reload entire page for PWA to realize we are back in application scope
			} catch (e) {
				console.error(e);
			}
		};

		if (auth.isAuthenticated) {
			obtainOurAccessTokenAndRedirect();
		}
	}, [auth.isAuthenticated]);

	const initiateLogin = () => {
		setLoginAttempts(loginAttempts + 1);
		auth.signinRedirect();
	};

	// Dont show Spinner, otherwise it flickers
	if (loading) {
		return <></>;
	}

	return (
		<>
			<div style={{display: 'flex', justifyContent: 'center'}}>
				<div
					style={{
						padding: 20,
						maxWidth: 500,
						display: 'flex',
						flexDirection: 'column',
						flexGrow: 1,
						alignItems: 'center',
						justifyContent: 'center',
						alignSelf: 'center',
						justifySelf: 'center',
						gap: '10px',
					}}
				>
					<>
						<h2 style={{margin: 0}}>New edu-ID Login</h2>

						<p>
							Login to Bestande directly with your edu-ID Account!
							Click the button "Switch edu-ID" below to log in.
						</p>

						{loginAttempts >= 2 ? (
							<>
								<p>
									It seems like eduID currently has an issue.
									Please contact{' '}
									<a href="mailto:info@bestande.ch">
										info@bestande.ch
									</a>{' '}
									so we can help you login.
								</p>
								<StyledInput
									onClick={initiateLogin}
									type="image"
									src="/static/eduidbutton_neg.svg"
									style={{opacity: 0.5}}
								/>
							</>
						) : (
							<StyledInput
								onClick={initiateLogin}
								type="image"
								src="/static/eduidbutton_neg.svg"
							/>
						)}

						<p>
							<i>
								Disclaimer: Bestande has no official affiliation with
								the University of Zurich. We are an independent
								student-led service offered by VSUZH.
							</i>
						</p>
					</>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default Login;
