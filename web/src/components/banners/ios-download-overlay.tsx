import React, {useEffect} from 'react';
import styled from 'styled-components';
import IOS_Download_Icon from '../../static/IOS_Download_Icon';

const Backdrop = styled.div<{isVisible: boolean}>`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);

	display: ${(props) => (props.isVisible ? 'block' : 'none')};

	z-index: 998;
`;

const OverlayIOS = styled.div<{isVisible: boolean}>`
	position: fixed;
	width: 328px;
	background-color: white;
	border-radius: 10px;
	padding: 20px;
	z-index: 999;

	top: 50%;
	left: 50%;
	transform: ${({isVisible}) =>
		isVisible ? 'translate(-50%, -50%)' : 'translate(-50%, 100%)'};
	opacity: ${({isVisible}) => (isVisible ? 1 : 0)};
	visibility: ${({isVisible}) => (isVisible ? 'visible' : 'hidden')};

	transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out,
		visibility 0.5s ease-in-out;

	overflow-y: auto;
	max-height: 80vh;
`;

const InnerIOS = styled.div`
	display: flex;
	flex-direction: column;
	gap: 30px;
`;

const IosHeader = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
	font-size: 20px;
	font-weight: 700;
	color: black;
`;

const IosCloseButton = styled.div`
	background-color: rgb(46, 204, 113);
	text-transform: uppercase;
	height: 40px;
	width: 100%;
	border-radius: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: background-color 0.3s;
`;

const ImageContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 70px;
	height: 70px;
	background: white;
	border-radius: 10px;
`;

const IosDownloadOverlay = (props: {
	isVisible: boolean;
	closeOverlay: () => void;
}) => {
	return (
		<>
			<Backdrop isVisible={props.isVisible} />
			<OverlayIOS isVisible={props.isVisible}>
				<InnerIOS>
					<IosHeader>
						<ImageContainer>
							<img src="/static/logo.png" />
						</ImageContainer>
						<h4 style={{margin: 0}}>Installiere Bestande</h4>
					</IosHeader>
					<p style={{margin: 0, hyphens: 'none'}}>
						Installiere die Bestande App auf deinem Handy um sie immer
						Griffbereit zu haben. Ganz ohne Appstore!
					</p>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: '5px',
						}}
					>
						<div
							style={{
								display: 'flex',
								gap: '10px',
								alignItems: 'center',
							}}
						>
							<p style={{margin: 0}}>1. Klicke unten auf </p>
							<div style={{marginTop: '2px'}}>
								<IOS_Download_Icon />
							</div>
						</div>
						<img src="/static/IOS_Download1.png" />
					</div>

					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: '5px',
						}}
					>
						<p style={{margin: 0}}>
							2. Wähle <strong> Zum Home-Bildschirm</strong>{' '}
						</p>
						<img src="/static/IOS_Download2.png" />
					</div>

					<IosCloseButton onClick={props.closeOverlay}>
						Schliessen
					</IosCloseButton>
				</InnerIOS>
			</OverlayIOS>
		</>
	);
};

export default IosDownloadOverlay;
