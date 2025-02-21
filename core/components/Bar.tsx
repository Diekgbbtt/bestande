import React from 'react';
import {View} from 'react-native';
import {useAppearance} from '../functions/use-appearance';

export const Bar = (props: {ratio: number; color: string}) => {
	const appearance = useAppearance();
	return (
		<View
			style={{
				height: 7,
				borderRadius: 5,
				overflow: 'hidden',
				backgroundColor: appearance.BAR_BACKGROUND,
				flexDirection: 'row',
			}}
		>
			<View
				style={{
					backgroundColor: props.color,
					borderRadius: 5,
					overflow: 'hidden',
					flex: props.ratio,
				}}
			/>
			<View style={{flex: 1 - props.ratio}} />
		</View>
	);
};
