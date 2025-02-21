import {NavigationProp, NavigationState} from '@react-navigation/native';
import {RN5Routes} from '../data/rn5-routes';

export type Navigation = NavigationProp<
	RN5Routes,
	any,
	NavigationState,
	{},
	{}
>;
