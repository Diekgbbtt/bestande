import {useWindowDimensions} from 'react-native';

export const useTablet = () => {
	const dim = useWindowDimensions();
	return dim.width > 900;
};

export const useSideBarWidth = () => {
	const dim = useWindowDimensions();
	const tablet = useTablet();
	return tablet ? Math.max(350, dim.width * 0.25) : dim.width;
};
