import React from 'react';
import styled from 'styled-components';
import {ORANGE} from '../../../../core/models/colors';

const Container = styled.div`
	max-width: 400px;
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-bottom: 15px;
`;

const StarContainer = styled.div`
	flex-direction: row;
	margin-top: 6px;
`;

const Star = ({active}: {active?: boolean}) => {
	return (
		<i
			className="material-icons"
			style={{color: active ? 'white' : 'rgba(255, 255, 255, 0.3)'}}
		>
			star
		</i>
	);
};

const Stars = ({stars}) => {
	/* eslint-disable react/no-array-index-key */
	return (
		<StarContainer>
			{new Array(stars).fill(1).map((a, i) => (
				<Star key={i} active />
			))}
			{new Array(5 - stars).fill(1).map((a, i) => (
				<Star key={i} />
			))}
		</StarContainer>
	);
	/* eslint-enable react/no-array-index-key */
};

const Tooltip = styled.div`
	width: 20px;
	height: 20px;
	background: ${ORANGE};
	transform: rotate(45deg);
	position: absolute;
	margin-left: -4px;
	margin-top: -4px;
	top: 50%;
	margin-top: -10px;
	left: 0;
	border-radius: 3px;
`;

const Review = styled.div`
	background: ${ORANGE};
	height: 60px;
	width: 300px;
	border-radius: 3px;
	position: relative;
	display: flex;
	align-items: center;
	padding-left: 20px;
`;

const Avatar = styled.div`
	background: rgba(0, 0, 0, 0.1);
	height: 30px;
	width: 30px;
	position: relative;
	margin-left: 5px;
	border-radius: 50%;
	margin-right: 20px;
`;

const InfoAnimation = ({stars, background}) => {
	return (
		<Container>
			<Avatar />
			<Review style={{background}}>
				<Tooltip style={{background}} />
				<Stars stars={stars} />
			</Review>
		</Container>
	);
};

export default InfoAnimation;
