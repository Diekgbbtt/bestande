import {SliderValue} from './MensaDietFilter';

export type MultiSliderProps = {
	color: string;
	values: [number, number];
	onChange: (e: [number, number]) => void;
	customMarkerLeft: (e: SliderValue) => JSX.Element;
	customMarkerRight: (e: SliderValue) => JSX.Element;
	min: number;
	max: number;
	step: number;
	formatValue: (value: string) => string;
};
