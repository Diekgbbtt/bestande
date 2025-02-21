import {bool} from 'aws-sdk/clients/signer';

export const isIOS = (): boolean => {
	return (
		[
			'iPad Simulator',
			'iPhone Simulator',
			'iPod Simulator',
			'iPad',
			'iPhone',
			'iPod',
		].includes(navigator.platform) ||
		// iPad on iOS 13 detection
		(navigator.userAgent.includes('Mac') && 'ontouchend' in document)
	);
};

export const isMobile = (): boolean => {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
		navigator.userAgent
	);
};

export const isUsingApp = (): boolean => {
	return window.matchMedia('(display-mode: standalone)')?.matches;
};

const bestandePrefix = 'bestande_';

export const usePromptInterval = (): {
	checkIfDownloadAppPromptMayBeAskedAgain: () => boolean;
	continueDownloadAppPromptInterval: () => void;
	checkIfPushNotificationsWebPromptMayBeAskedAgain: () => boolean;
	continuePushNotificationsWebPromptInterval: () => void;
	checkIfPushNotificationsAppPromptMayBeAskedAgain: () => boolean;
	continuePushNotificationsAppPromptInterval: () => void;
} => {
	const computeNextPromptDate = (numberOfPromptsAsked: number) => {
		if (numberOfPromptsAsked <= 0) {
			return new Date().getTime();
		} else if (numberOfPromptsAsked === 1) {
			// in 1 day
			return new Date().getTime() + 1 * 24 * 60 * 60 * 1000;
		} else if (numberOfPromptsAsked === 2) {
			// in 3 days
			return new Date().getTime() + 3 * 24 * 60 * 60 * 1000;
		} else if (numberOfPromptsAsked === 3) {
			// in 7 days
			return new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
		} else if (numberOfPromptsAsked === 4) {
			// in 30 days
			return new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
		} else {
			// in 365 days
			return new Date().getTime() + 365 * 24 * 60 * 60 * 1000;
		}
	};

	/* first ask after 1 day, 3 days, then 7 days, then 1 month, then after 1 year */
	const checkIfPromptMayBeAskedAgain = (nextPromptDateKey: string): boolean => {
		const nextPromptDateString: string | null = localStorage.getItem(
			nextPromptDateKey
		);
		if (!nextPromptDateString) {
			return true;
		}
		return Number(nextPromptDateString) < new Date().getTime();
	};

	const continuePromptInterval = (
		nextPromptDateKey: string,
		numberOfPromptsAskedKey: string
	): void => {
		const numberOfPromptsAskedLastTime = Number(
			localStorage.getItem(numberOfPromptsAskedKey) || 0
		);
		const numberOfPromptsNow = numberOfPromptsAskedLastTime + 1;
		const nextPromptDate = computeNextPromptDate(numberOfPromptsNow);
		localStorage.setItem(nextPromptDateKey, nextPromptDate.toString());
		localStorage.setItem(numberOfPromptsAskedKey, numberOfPromptsNow.toString());
	};

	const nextAppDownloadPromptDateKey = `${bestandePrefix}app_download_next_prompt_date`;

	const numberOfPromptsAppDownloadKey = `${bestandePrefix}number_of_app_download_prompts_asked`;

	const nextPushNotificationsWebPromptDateKey = `${bestandePrefix}push_notifications_web_next_prompt_date`;

	const numberOfPromptsPushNotificationsWebKey = `${bestandePrefix}number_of_push_notifications_web_prompts_asked`;

	const nextPushNotificationsAppPromptDateKey = `${bestandePrefix}push_notifications_app_next_prompt_date`;

	const numberOfPromptsPushNotificationsAppKey = `${bestandePrefix}number_of_push_notifications_app_prompts_asked`;

	return {
		checkIfDownloadAppPromptMayBeAskedAgain: () =>
			checkIfPromptMayBeAskedAgain(nextAppDownloadPromptDateKey),
		continueDownloadAppPromptInterval: () =>
			continuePromptInterval(
				nextAppDownloadPromptDateKey,
				numberOfPromptsAppDownloadKey
			),
		checkIfPushNotificationsWebPromptMayBeAskedAgain: () =>
			checkIfPromptMayBeAskedAgain(nextPushNotificationsWebPromptDateKey),
		continuePushNotificationsWebPromptInterval: () =>
			continuePromptInterval(
				nextPushNotificationsWebPromptDateKey,
				numberOfPromptsPushNotificationsWebKey
			),
		checkIfPushNotificationsAppPromptMayBeAskedAgain: () =>
			checkIfPromptMayBeAskedAgain(nextPushNotificationsAppPromptDateKey),
		continuePushNotificationsAppPromptInterval: () =>
			continuePromptInterval(
				nextPushNotificationsAppPromptDateKey,
				numberOfPromptsPushNotificationsAppKey
			),
	};
};
