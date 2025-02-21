import Slider from '@react-native-community/slider'; // eslint-disable-line
import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-normalized';
import styled from 'styled-components/native';
import {Base, HSpace} from '../../../core/components/Base';

const Label = styled(Text)`
	width: 50px;
	text-align: right;
	font-size: 18px;
	color: ${(props) => props.theme.TITLE};
`;

export const SliderWithValue = (props: {
	minimumTrackTintColor: string;
	onValueChange: (value: number) => void;
	onSlidingComplete: (value: number) => void;
	value?: number;
	customLabel?: string;
	precision: number;
	minimum: number;
	maximum: number;
	step: number;
}) => {
	return (
		<Base padded>
			<View
				style={{
					flex: 1,
					paddingTop: 3,
					paddingBottom: 3,
					flexDirection: 'row',
					alignItems: 'center',
				}}
			>
				<Slider
					step={props.step}
					style={{flex: 1, height: 40}}
					minimumValue={props.minimum}
					maximumValue={props.maximum}
					minimumTrackTintColor={props.minimumTrackTintColor}
					onValueChange={(value) => {
						props.onValueChange(value);
					}}
					onSlidingComplete={(value) => {
						props.onSlidingComplete(value);
					}}
					value={props.value}
				/>
				<HSpace />
				<Label>
					{props.customLabel
						? props.customLabel
						: props.value
						? props.value.toFixed(props.precision)
						: null}
				</Label>
			</View>
		</Base>
	);
};
