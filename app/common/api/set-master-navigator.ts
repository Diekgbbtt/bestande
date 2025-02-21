import {NavigationContainerRef} from '@react-navigation/native';
import {createRef} from 'react';
import {RN5Routes} from '../../../core/data/rn5-routes';

export const masterNavigator = createRef<NavigationContainerRef>();

export const globalNavigate = <T extends keyof RN5Routes>(
	route: T,
	params?: RN5Routes[T]
) => {
	masterNavigator.current?.navigate(route, params);
};

export const globalNavigationDispatch = (payload) => {
	masterNavigator.current?.dispatch(payload);
};
