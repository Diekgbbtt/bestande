import React, {useEffect} from 'react';
import {isIOS, isMobile, isUsingApp, usePromptInterval} from '../utils/utils';

import IosDownloadOverlay from './ios-download-overlay';
import AndroidDownloadBanner from './android-download-banner';

const AppDownloadBanner = () => {
	const [installEvent, setInstallEvent] = React.useState<any>(false);
	const [showIosOverlay, setShowIosOverlay] = React.useState<boolean>(false);

	const {
		checkIfDownloadAppPromptMayBeAskedAgain,
		continueDownloadAppPromptInterval,
	} = usePromptInterval();

	useEffect(() => {
		if (!isUsingApp() && !isIOS() && isMobile()) {
			window.addEventListener('appinstalled', () => {
				setInstallEvent(null);
			});

			window.addEventListener('beforeinstallprompt', (e) => {
				e.preventDefault();
				if (checkIfDownloadAppPromptMayBeAskedAgain()) {
					continueDownloadAppPromptInterval();
					setTimeout(() => {
						setInstallEvent(e);
					}, 2000);
				}
			});
		}
		if (
			!isUsingApp() &&
			isIOS() &&
			isMobile() &&
			checkIfDownloadAppPromptMayBeAskedAgain()
		) {
			continueDownloadAppPromptInterval();
			setTimeout(() => {
				setShowIosOverlay(true);
			}, 2000);
		}
	}, []);

	useEffect(() => {
		// Disable scrolling on the main page when the overlay is visible
		if (showIosOverlay) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}

		// Cleanup function to reset the overflow style when the component is unmounted
		return () => {
			document.body.style.overflow = '';
		};
	}, [showIosOverlay]);

	const installPwa = () => {
		installEvent?.prompt();
	};

	const clickAwayPwa = () => {
		setInstallEvent(null);
	};

	const closeIosOverlay = () => {
		setShowIosOverlay(false);
	};

	return (
		<>
			<AndroidDownloadBanner
				isVisible={!!installEvent}
				closeBanner={clickAwayPwa}
				promptInstall={installPwa}
			/>
			<IosDownloadOverlay
				isVisible={showIosOverlay}
				closeOverlay={closeIosOverlay}
			/>
		</>
	);
};

export default AppDownloadBanner;
