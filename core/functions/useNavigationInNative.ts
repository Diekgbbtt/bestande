import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RN5Routes} from '../data/rn5-routes';

const useUniversalNavigation: <T extends keyof RN5Routes>() => NavigationProp<
	RN5Routes,
	T
> = useNavigation;

export const useNavigationInNative = useUniversalNavigation;
