import React from 'react';
import styled from 'styled-components';

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

const BestandeLogoTextDiv = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 10px;
`;

const BestandeText = styled.div`
	font-weight: 700;
	text-transform: uppercase;
	color: white;
	margin-top: 5px;
`;
const InstallationButton = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 20px;
	color: darkgreen;
	text-transform: uppercase;
	font-weight: 700;
	padding: 10px;
	border-radius: 10px;
	background: white;
	cursor: pointer;
	width: 180px;
	height: 50px;
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

const BannerDiv = styled.div<{isVisible: boolean}>`
	position: fixed;
	z-index: 999;
	display: flex;
	height: 120px;
	align-items: center;
	justify-content: space-around;
	background-color: #2ecc71;
	width: 95%;
	max-width: 500px;
	border-radius: 10px;
	left: 50%;
	bottom: 0px;
	transform: ${({isVisible}) =>
		isVisible ? 'translate(-50%, -10px)' : 'translate(-50%, 150%)'};
	transition: transform 0.5s ease-in-out;
`;

const AndroidDownloadBanner = (props: {
	isVisible: boolean;
	closeBanner: () => void;
	promptInstall: () => void;
}) => {
	return (
		<>
			<BannerDiv isVisible={props.isVisible}>
				<CloseButtonDiv>
					<CloseButton onClick={props.closeBanner}>x</CloseButton>
				</CloseButtonDiv>
				<BestandeLogoTextDiv>
					<ImageContainer>
						<img src="/static/logo.png"></img>
					</ImageContainer>
					<BestandeText>Bestande</BestandeText>
				</BestandeLogoTextDiv>
				<InstallationButton onClick={props.promptInstall}>
					Installieren
				</InstallationButton>
			</BannerDiv>
		</>
	);
};

export default AndroidDownloadBanner;
