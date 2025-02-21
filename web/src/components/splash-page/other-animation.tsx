import {darken} from 'polished';
import React from 'react';
import styled from 'styled-components';
import {ORANGE} from '../../../../core/models/colors';

const Container = styled.div`
	flex-direction: row;
	display: flex;
`;

const Card = styled.div<{
	darken?: number;
}>`
	display: inline-block;
	border-radius: 3px;
	width: 80px;
	height: 80px;
	display: flex;
	margin-left: 10px;
	margin-right: 10px;
	justify-content: center;
	align-items: center;
	background: ${(props) => darken(props.darken || 0, ORANGE)};
	i {
		font-size: 36px;
		color: white;
	}
`;

const OtherAnimation = ({food}: {food?: boolean}) => {
	return (
		<Container>
			{food ? null : (
				<Card darken={-0.05}>
					<i className="material-icons">chat_bubble</i>
				</Card>
			)}
			<Card>
				<i className="material-icons">restaurant_menu</i>
			</Card>
			{food ? null : (
				<Card darken={0.05}>
					<i className="material-icons">search</i>
				</Card>
			)}
		</Container>
	);
};

export default OtherAnimation;
