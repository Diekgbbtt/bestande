import React from 'react';
import styled from 'styled-components/native';
import {PromotionResponse} from '../../../core/models/promotion';
import {PromotedEventCell} from './PromotedEventCell';

const Container = styled.View<{
	theme: {
		promotedEventHeight: number;
	};
}>`
	height: ${(props) => props.theme.promotedEventHeight}px;
`;

const WeekDayPromotions = (props: {promotions: PromotionResponse[]}) => {
	return (
		<Container>
			{props.promotions.map((p) => {
				return <PromotedEventCell key={p._id} promotion={p} />;
			})}
		</Container>
	);
};

export default WeekDayPromotions;
