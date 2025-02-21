import React from 'react';
import StarsView from './stars-web';

// ts-unused-exports:disable-next-line
export type StarProps = {
	size?: number;
	emptyStar?: any;
	selectedStar?: (star: number) => void;
	rating: number | null;
	emptyStarColor?: string;
	disabled?: boolean;
};
const Stars = (props: StarProps) => {
	return <StarsView size={props.size} half stars={props.rating || 0} />;
};

// ts-unused-exports:disable-next-line
export default Stars;
