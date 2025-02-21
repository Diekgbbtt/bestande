import React from 'react';
import {View} from 'react-native';
import Animated from 'react-native-reanimated';
import {Circle, Svg} from 'react-native-svg';
import {useAppearance} from '../../../core/functions/use-appearance';

const size = 20;
const padding = 4;
const strokeWidth = 4;
const radius = (size - strokeWidth) / 2;
const circumference = radius * 2 * Math.PI;

const AnimatedCircle = Animated.createAnimatedComponent<any>(Circle);

export const CircularProgress: React.FC<{progress: number}> = (props) => {
	const alpha = Math.PI * 2 - props.progress * (Math.PI * 2);
	const strokeDashOffset = alpha * radius;
	const appearance = useAppearance();
	return (
		<View
			style={{
				width: size + padding,
				borderRadius: (size + padding) / 2,
				height: size + padding,
				justifyContent: 'center',
				alignItems: 'center',
				transform: [
					{
						rotate: '-90deg',
					},
				],
			}}
		>
			<Svg width={size} height={size}>
				<AnimatedCircle
					stroke={appearance.SUBTITLE}
					r={radius}
					cx={size / 2}
					cy={size / 2}
					fill="none"
					strokeLinecap="round"
					strokeWidth={strokeWidth}
					strokeDashoffset={strokeDashOffset}
					strokeDasharray={`${circumference} ${circumference}`}
				/>
			</Svg>
		</View>
	);
};
