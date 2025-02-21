import {useWindowDimensions} from 'react-native';

export const TIMETABLE_PADDING_LEFT = 35;

export const useTimetableColumnWidth = () => {
	const dim = useWindowDimensions();
	return Math.max(140, (dim.width - TIMETABLE_PADDING_LEFT) / 7);
};
