import React, {useEffect, useState} from 'react';
import styled, {keyframes} from 'styled-components';

const BannerDiv = styled.div<{isVisible: boolean; type: string}>`
	position: fixed;
	z-index: 1000;
	display: flex;
	flex-direction: row;
	align-items: center; /* Align items vertically center */
	justify-content: space-between;
	background-color: white;
	width: 95%;
	max-width: 500px;
	left: 50%;
	transform: ${({isVisible}) =>
		isVisible ? 'translate(-50%, 20px)' : 'translate(-50%, -150%)'};
	border-radius: 10px;
	padding: 10px 20px;
	transition: transform 0.5s ease-in-out;
	border: 2px solid ${({type}) => (type === 'error' ? 'red' : 'green')};
`;

const CloseButton = styled.button`
	background: none;
	border: none;
	font-size: 20px;
	cursor: pointer;
	position: absolute;
	top: 10px;
	right: 20px;
`;

const TextContainer = styled.div`
	flex-grow: 1;
	margin-right: 30px;
	font-weight: 550;
	hyphens: none;
`;

const CountdownLine = styled.div<{timeLeft: number; type: string}>`
	position: absolute;
	bottom: -4px;
	right: 2%;
	left: 2%;
	height: 5px;
	border-radius: 20px;
	background-color: ${({type}) => (type === 'error' ? 'red' : 'green')};
	width: ${({timeLeft}) => `${(timeLeft / 7) * 96}%`};
	transition: width 1s linear;
`;

const ErrorSuccessBanner = () => {
	const [visible, setVisible] = useState(false);
	const [message, setMessage] = useState('');
	const [type, setType] = useState('');
	const [timeLeft, setTimeLeft] = useState(8); // 6 seconds timer

	useEffect(() => {
		const showBanner = (e) => {
			setMessage(e.detail.message);
			setType(e.detail.type);
			setVisible(true);
			setTimeLeft(8); // Reset the timer
		};

		window.addEventListener('showBanner', showBanner);

		return () => {
			window.removeEventListener('showBanner', showBanner);
		};
	}, []);

	useEffect(() => {
		if (!visible) return;

		const timer =
			timeLeft > 0 && setInterval(() => setTimeLeft(timeLeft - 1), 1000);
		if (timeLeft === 0) setVisible(false);

		return () => {
			if (timer) {
				clearInterval(timer);
			}
		};
	}, [visible, timeLeft]);

	const messageLines = message.split('\n').map((line, index) => (
		<React.Fragment key={index}>
			{line}
			<br />
		</React.Fragment>
	));

	if (!visible) return null;

	return (
		<>
			<BannerDiv isVisible={visible} type={type}>
				<TextContainer>{messageLines}</TextContainer>
				<CloseButton onClick={() => setVisible(false)}>X</CloseButton>
				<CountdownLine timeLeft={timeLeft - 1} type={type} />
			</BannerDiv>
		</>
	);
};

export default ErrorSuccessBanner;
