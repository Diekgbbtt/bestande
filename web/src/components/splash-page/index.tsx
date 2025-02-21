import React from 'react';
import styled from 'styled-components';
import {mobile} from '../../../../core/components/layout/responsive';
import Title from './title';
import {isIOS, isMobile} from '../utils/utils';
import IosDownloadOverlay from '../banners/ios-download-overlay';
import { Footer } from '../footer';

const Container = styled.div`
	background: white;
	flex: 1;
`;

const Header = styled.div`
	display: flex;
	background: white;
	position: relative;
	overflow: hidden;
	flex-direction: column;
`;

const HeaderContent = styled.div`
	max-width: 1000px;
	margin: auto;
	display: flex;
	padding-top: 40px;
	padding-bottom: 40px;
	/* ${mobile`
		display: block;
		height: 700px;
		padding-top: 40px;
	`}; */
`;

const LogoType = styled.img`
	width: 150px;
	filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.1));
	margin-bottom: 8px;
`;

const LogoRow = styled.div`
	margin-top: 24px;
	display: flex;
	flex-direction: row;
	align-items: center;
`;

const LogoRowImg = styled.img`
	margin-bottom: 8px;
	width: 150px;
`;

const HeaderCenter = styled.div`
	flex: 2;
	padding: 0 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const HeaderLeft = styled.div`
	flex: 2;
	padding: 0 20px;
	display: flex;
	flex-direction: column;
`;

const HeaderRight = styled.div`
	flex: 2;
	font-weight: bold;
	display: flex;
	width: 500px;
	padding-top: 40px;
	flex-direction: column;
	align-items: flex-end;
	position: relative;
	${mobile`
		width: 100%;
		align-items: center;
	`};
`;

const Description = styled.div`
	color: rgba(0, 0, 0, 0.6);
	hyphens: none;
	font-weight: 500;
	margin-bottom: 20px;
	max-width: 500px;
`;

const LargeEmoji = styled.div`
	font-size: 72px;
	hyphens: none;
	font-weight: 500;
	margin-bottom: 20px;
`;

const LargeTitle = styled(Title)`
	font-size: 32px;
	margin-bottom: -20px;
	text-align: center;

	@media only screen and (max-width: 400px) {
		font-size: 24px;
	}
`;

const ShareButton = styled.button`
	background-color: #007bff;
	color: white;
	padding: 10px 20px;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	font-size: 16px;
	display: flex;
	align-items: center;
	justify-content: center; // Center contents horizontally
	gap: 8px; // Spacing between icon and text
	margin-top: 20px;

	&:hover {
		background-color: #0056b3;
	}
`;

const ShareIcon = styled.img`
	width: 24px;
	height: 24px;
	pointer-events: none;
`;

const SplashPage = () => {
	const [installEvent, setInstallEvent] = React.useState<any>(null);
	const [isIosOverlayVisible, setIsIosOverlayVisible] = React.useState(false);

	React.useEffect(() => {
		if (!isIOS()) {
			window.addEventListener('appinstalled', () => {
				setInstallEvent(null);
			});

			window.addEventListener('beforeinstallprompt', (e) => {
				e.preventDefault();
				setInstallEvent(e);
			});
		}
	});

	const installPwa = () => {
		if (!installEvent) {
			console.error('Not able to install pwa');
			return;
		}
		installEvent.prompt();
	};

	const openIosOverlay = () => {
		setIsIosOverlayVisible(true);
	};

	const closeIosOverlay = () => {
		setIsIosOverlayVisible(false);
	};

	const shareApp = async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: 'Bestande',
					text:
						'Check out the Bestande App - perfect for course ratings and more!',
					url: 'https://bestande.ch',
				});
				console.log('App shared successfully');
			} catch (error) {
				console.error('Error sharing', error);
			}
		} else {
			console.log('Web Share not supported on this browser');
		}
	};

	return (
		<Container>
			<Header>
				<HeaderContent>
					<HeaderCenter>
						<LogoType src="/static/bestande-type-small.png" />

						<LargeTitle>Bestande isch zrugg!</LargeTitle>
						<Title>Bestande is back!</Title>
						<LargeEmoji>🎉</LargeEmoji>
						<Description>
							Bestande is <b>the original course rating application</b>
							, founded in 2015. Bestande is a student-led service offered by the VSUZH. It has no official affiliation with the University of Zurich. The app does not receive data on academic achievements from the University of Zurich; instead, it obtains data directly from the students themselves, who transfer their information to the app. Over 20'000+ students use our
							application, rating over 70'000+ courses so far. After a
							year long break, we are back! A student-lead team from
							the{' '}
							<a style={{color: 'black'}} href="https://icuzh.ch">
								ICU
							</a>{' '}
							is now maintaining and extending the application.
						</Description>
						<Description>
							<b>History 2015-2022</b>
							<br />
							Bestande was developed in 2015 by UZH student{' '}
							<a href="https://jonny.io" style={{color: 'black'}}>
								Jonny Burger
							</a>
							. He extended and maintained the app for seven years and
							is passing the app on to the{' '}
							<a style={{color: 'black'}} href="https://icuzh.ch">
								ICU
							</a>{' '}
							and{' '}
							<a style={{color: 'black'}} href="https://vsuzh.ch">
								VSUZH
							</a>{' '}
							as of 2023.
						</Description>
						{isMobile() && !isIOS() ? (
							<Description style={{marginRight: 'auto'}}>
								<b>Android App</b>
								<br />
								On your Android device click
								<span
									style={{
										textDecoration: 'underline',
										cursor: 'pointer',
										margin: '0 7px',
										color: 'blue',
									}}
									onClick={() => installPwa()}
								>
									here
								</span>
								to install the App.
							</Description>
						) : null}
						{isMobile() && isIOS() ? (
							<>
								<IosDownloadOverlay
									isVisible={isIosOverlayVisible}
									closeOverlay={closeIosOverlay}
								/>
								<Description style={{marginRight: 'auto'}}>
									<b>IOS App</b>
									<br />
									Install the IOS App without an Appstore in 2
									clicks. <br />
									Click
									<span
										style={{
											textDecoration: 'underline',
											cursor: 'pointer',
											margin: '0 7px',
											color: 'blue',
										}}
										onClick={openIosOverlay}
									>
										here
									</span>
									to see the installation instructions.
								</Description>
							</>
						) : null}
						<Description>
							<b>Future</b>
							<br />
							We will continue on improving and extending the
							application to make it easier for you to find great
							courses at UZH (and also at other universities). We
							promise that this service will remain in students hands
							forever, free forever, and non-commercial forever. Find
							out why on the official{' '}
							<a
								style={{color: 'black'}}
								href="https://vsuzh.ch/bestande"
							>
								VSUZH student association website
							</a>
							. Interested in working on the project as a developer?
							Contact us at{' '}
							<a style={{color: 'black'}} href="mailto:board@icuzh.ch">
								board@icuzh.ch
							</a>
							.
						</Description>
						<Description>
							<b>Share the App</b>
							<br />
							Share the app with your friends, it's perfect for knowing
							about which courses you should take and discover what
							other students think about it. The more people there are,
							the better the app will be. <br />
							What are you waiting for?
						</Description>
						{isMobile() && (
							<ShareButton onClick={shareApp}>
								<ShareIcon
									src="/static/icons-pwa/ios-share.svg"
									alt="Share Icon"
								/>
								Share the App
							</ShareButton>
						)}

						<LogoRow>
							<a href="https://icuzh.ch">
								<LogoRowImg
									src="/static/icu_logo_full.png"
									style={{width: 175}}
								/>
							</a>
							<a href="https://vsuzh.ch">
								<LogoRowImg
									src="/static/vsuzh_logo.png"
									style={{width: 115, marginTop: 10}}
								/>
							</a>
						</LogoRow>
					</HeaderCenter>
					{/* <HeaderRight>
						<ScreenshotShowcase />
					</HeaderRight> */}
				</HeaderContent>
			</Header>
			<Footer />
		</Container>
	);
};

export default SplashPage;

