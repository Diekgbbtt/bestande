import React, {useState} from 'react';
import {Text} from 'react-native-normalized';
import {getTrackBackground, Range} from 'react-range';
import styled from 'styled-components';
import {uiKit} from '../functions/ui-kit';
import {MultiSliderProps} from './MultiSliderProps';

const RangeLabel = styled(Text)`
	padding-left: 3px;
	font-weight: bold;
`;

// ts-unused-exports:disable-next-line
export const MultiSlider = (props: MultiSliderProps) => {
	const [currentValue, setCurrentValue] = useState<[number, number]>(
		props.values
	);
	return (
		<div
			style={{
				width: '100%',
			}}
		>
			<div
				style={{
					paddingLeft: 10,
					paddingRight: 10,
					marginBottom: 8,
				}}
			>
				<Range
					step={props.step}
					min={props.min}
					max={props.max}
					values={currentValue}
					onChange={(val) => setCurrentValue([val[0], val[1]])}
					onFinalChange={(val) => props.onChange([val[0], val[1]])}
					renderTrack={({props: p, children}) => {
						const {onMouseDown, ...otherP} = p;
						return (
							<div
								onMouseDown={onMouseDown}
								{...otherP}
								style={{
									...p.style,
									height: 6,
									width: '100%',
									background: getTrackBackground({
										values: currentValue,
										colors: [
											'rgba(0, 0, 0, 0.1)',
											props.color,
											'rgba(0, 0, 0, 0.1)',
										],
										min: props.min,
										max: props.max,
									}),
									borderRadius: 3,
								}}
							>
								{children}
							</div>
						);
					}}
					renderThumb={({props: p}) => (
						<div
							{...p}
							style={{
								...p.style,
								height: 18,
								width: 18,
								borderRadius: 9,
								background: '#fff',
								border: '2px solid ' + props.color,
							}}
						/>
					)}
				/>
			</div>
			<RangeLabel style={uiKit.footnoteObject}>
				{props.formatValue(`${currentValue[0]} - ${currentValue[1]}`)}
			</RangeLabel>
		</div>
	);
};
