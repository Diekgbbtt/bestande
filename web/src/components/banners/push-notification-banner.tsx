import React, {useEffect} from 'react';
import {isIOS, isMobile, isUsingApp, usePromptInterval} from '../utils/utils';
import styled from 'styled-components';
import {User, onAuthStateChanged} from 'firebase/auth';
import {auth} from '../../firebase-frontend';
import OneSignal from 'react-onesignal';
import {isPushNotificationSupported} from '../push-notifications/push-notifications';

const CloseButtonDiv = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: lightgreen;
	height: 40px;
	width: 40px;
	border-radius: 10px;
`;

const CloseButton = styled.div`
	cursor: pointer;
	transform: scale(2);
	color: white;
	margin-top: -4px;
`;

const ActivationButton = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 15px;
	color: darkgreen;
	text-transform: uppercase;
	font-weight: 700;
	padding: 10px;
	border-radius: 10px;
	background: white;
	cursor: pointer;
	width: 150px;
	height: 50px;
	margin-left: auto;
`;

const ImageContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 64px;
	height: 64px;
	background: white;
	border-radius: 10px;
`;

const TopRowContainer = styled.div`
	display: flex;
	align-items: center;
	width: 100%;
	gap: 10px;
`;

const BottomRowContainer = styled.div`
	display: flex;
	align-items: center;
	align-items: center;
	width: 100%;
`;

const BannerDiv = styled.div<{isVisible: boolean}>`
	position: fixed;
	z-index: 999;
	display: flex;
	flex-direction: column;
	height: 150px;
	align-items: center;
	justify-content: space-around;
	background-color: #2ecc71;
	width: 95%;
	max-width: 500px;
	left: 50%;
	transform: ${({isVisible}) =>
		isVisible ? 'translate(-50%, 20px)' : 'translate(-50%, -150%)'};
	border-radius: 10px;
	gap: 5px;
	padding: 10px 20px;
	transition: transform 0.5s ease-in-out;
`;

const PushNotificationBanner = () => {
	const [isVisible, setIsVisible] = React.useState<boolean>(false);

	const {
		checkIfPushNotificationsAppPromptMayBeAskedAgain,
		continuePushNotificationsAppPromptInterval,
	} = usePromptInterval();

	useEffect(() => {
		const checkNotifications = async () => {
			//Only show Push-Notification Banner when user is using the pwa app
			if (
				isUsingApp() &&
				Notification.permission === 'default' &&
				checkIfPushNotificationsAppPromptMayBeAskedAgain() &&
				isPushNotificationSupported()
			) {
				continuePushNotificationsAppPromptInterval();
				// Wait 2 seconds before showing the push notification banner
				setTimeout(async () => {
					setIsVisible(true);
					// }
				}, 2000);
			}

			//To register the user with OneSignal if he has already accepted/declined the native push notification prompt
			if (Notification.permission !== 'default') {
				OneSignal.Notifications.requestPermission();
			}
		};
		checkNotifications();
	}, []);

	useEffect(() => {
		// This is a subscription to the auth state
		const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
			if (firebaseUser?.email && firebaseUser.emailVerified) {
				OneSignal.login(firebaseUser.email);
			}
		});
		// Unsubscribe from the listener when the component unmounts
		return () => unsubscribe();
	}, []);

	useEffect(() => {
		if (auth?.currentUser?.email && auth?.currentUser.emailVerified) {
			OneSignal.login(auth.currentUser.email);
		}
	}, []);

	const acceptPushNotification = async () => {
		setIsVisible(false);
		await OneSignal.Notifications.requestPermission();

		//Somehow the users aren't registered immediately with OneSignal so we try again without the prompt actually showing
		if (Notification.permission !== 'default') {
			await OneSignal.Notifications.requestPermission();
		}
	};

	const closePushNotification = async () => {
		setIsVisible(false);
	};

	return (
		<>
			<BannerDiv isVisible={isVisible}>
				<TopRowContainer>
					<ImageContainer>
						<img src="/static/logo.png" />
					</ImageContainer>
					<div>
						Aktiviere Push-Notifications um immer auf dem aktuellsten
						Stand zu sein!
					</div>
				</TopRowContainer>
				<BottomRowContainer>
					<CloseButtonDiv>
						<CloseButton onClick={closePushNotification}>x</CloseButton>
					</CloseButtonDiv>
					<ActivationButton onClick={acceptPushNotification}>
						Aktivieren
					</ActivationButton>
				</BottomRowContainer>
			</BannerDiv>
		</>
	);
};

export default PushNotificationBanner;
