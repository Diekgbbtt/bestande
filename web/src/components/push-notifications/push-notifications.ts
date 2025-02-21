import OneSignal from 'react-onesignal';

export const initializeOneSignal = () => {
	OneSignal.init({
		appId: process.env.REACT_APP_ONESIGNAL_APP_ID || '',
		requiresUserPrivacyConsent: false,
		safari_web_id: process.env.REACT_APP_ONESIGNAL_SAFARI_WEB_ID || '',
		welcomeNotification: {
			title: 'Willkommen bei Bestande!',
			message: 'Erstelle noch heute dein erstes Rating!',
		},
		notifyButton: {
			enable: false,
		},
		persistNotification: true,
		autoResubscribe: true,
		serviceWorkerParam: {
			scope: '/static/',
		},
		serviceWorkerPath: 'static/OneSignalSDKWorker.js',
		serviceWorkerUpdaterPath: 'static/OneSignalSDKWorker.js',
		allowLocalhostAsSecureOrigin: true,
		autoRegister: false,
		promptOptions: {
			slidedown: {
				prompts: [
					{
						type: 'push',
						autoPrompt: false,
						text: {
							actionMessage:
								'Erlaube die Benachrichtigungen von Bestande um immer up-to-date zu bleiben!',
							acceptButton: 'Erlauben',
							cancelButton: 'Nein Danke',
						},
					},
				],
			},
		},
	});
};

export const isPushNotificationSupported = (): boolean => {
	return 'Notification' in window;
};
