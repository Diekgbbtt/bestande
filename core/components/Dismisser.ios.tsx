import React from 'react';
import {Platform, View} from 'react-native';
import {Image} from 'react-native-normalized';
import Animated from 'react-native-reanimated';
import styled from 'styled-components';
import {useAppearance} from '../functions/use-appearance';

const Square = styled(View)`
	align-self: center;
	margin-top: -42px;
`;

const Arrow = styled(Image)`
	height: 32px;
	width: 32px;
`;

// ts-unused-exports:disable-next-line
export const Dismisser: React.FC<{
	progress: Animated.Node<number> | null;
}> = (props) => {
	const appearance = useAppearance();
	if (Platform.OS !== 'ios' || !props.progress) {
		return null;
	}

	return (
		<Animated.View
			style={{
				opacity: props.progress,
			}}
		>
			<Square>
				<Arrow
					source={require('../assets/down.png')}
					style={{
						tintColor: appearance.SUBTITLE,
					}}
				/>
			</Square>
		</Animated.View>
	);
};
