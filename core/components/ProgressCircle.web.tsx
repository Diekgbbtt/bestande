import React from 'react';
import ProgressArc from 'react-progress-arc';

const PercentageCircle = (props: {color: string; percent: number}) => {
	return (
		<ProgressArc
			completed={props.percent / 100}
			diameter={30}
			background="rgba(0, 0, 0, 0.1)"
			stroke={props.color}
		/>
	);
};

// ts-unused-exports:disable-next-line
export default PercentageCircle;
