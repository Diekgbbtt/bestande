import MultiSliderComp from '@ptomasroos/react-native-multi-slider';
import React from 'react';
import {useWindowDimensions} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MultiSliderProps} from './MultiSliderProps';

export const MultiSlider = (props: MultiSliderProps) => {
	const {width} = useWindowDimensions();
	const safeArea = useSafeAreaInsets();
	const sliderWidth = width - 80 - safeArea.left - safeArea.right;
	return (
		<MultiSliderComp
			isMarkersSeparated
			customMarkerLeft={props.customMarkerLeft}
			customMarkerRight={props.customMarkerRight}
			onValuesChangeFinish={(e: [number, number]) => {
				props.onChange(e);
			}}
			markerContainerStyle={{
				width: 80,
				height: 60,
				marginTop: -6,
			}}
			values={props.values}
			min={props.min}
			max={props.max}
			step={props.step}
			sliderLength={sliderWidth}
			selectedStyle={{backgroundColor: props.color}}
			trackStyle={{
				height: 4,
				borderRadius: 2,
				backgroundColor: 'rgba(0, 0, 0, 0.1)',
			}}
		/>
	);
};
