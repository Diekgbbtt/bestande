import React from 'react';
import styled from 'styled-components';
import {ORANGE} from '../models/colors';

const StarContainer = styled.div`
	display: flex;
	flex-direction: row;
`;

const Star = styled.i.attrs({
	className: 'material-icons',
})<{
	size?: number;
	visible?: boolean;
	half?: boolean;
}>`
	font-size: ${(props) => (props.size ? props.size : 14)}px;
	color: ${(props) => (props.visible ? ORANGE : 'rgba(0, 0, 0, 0.2)')};
	opacity: ${(props) => (props.visible ? 1 : props.half ? 0.5 : 0)};
`;

const isHalf = (number: number) => {
	return number >= 0.25 && number < 0.75;
};

const Stars = (props: {
	stars: number;
	half?: boolean;
	size?: number;
	style?: any;
}) => {
	const {stars, half, size, ...otherProps} = props;
	return (
		<StarContainer {...otherProps}>
			{new Array(5).fill(1).map((k, i) => {
				const visible = stars - i - 0.25 >= 0;
				if (!half && !visible) {
					return null;
				}

				return (
					// eslint-disable-next-line react/no-array-index-key
					<Star key={i} size={size} visible={visible} half={half}>
						{isHalf(props.stars - i) ? 'star_half' : 'star'}
					</Star>
				);
			})}
		</StarContainer>
	);
};

export default Stars;
