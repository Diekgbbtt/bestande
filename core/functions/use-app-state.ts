import {shallowEqual, TypedUseSelectorHook, useSelector} from 'react-redux';
import {AppState} from '../types/app-state';
import {WebState} from '../types/web-state';

export const useAppState: TypedUseSelectorHook<AppState> = <TSelected>(
	fn: (state: AppState) => TSelected,
	equalityFn: (left: TSelected, right: TSelected) => boolean = shallowEqual
) => useSelector(fn, equalityFn);

export const useWebState: TypedUseSelectorHook<WebState> = <TSelected>(
	fn: (state: WebState) => TSelected,
	equalityFn: (left: TSelected, right: TSelected) => boolean = shallowEqual
) => useSelector(fn, equalityFn);

export const useIsomorphicState: TypedUseSelectorHook<WebState | AppState> = <
	TSelected
>(
	fn: (state: WebState | AppState) => TSelected,
	equalityFn: (left: TSelected, right: TSelected) => boolean = shallowEqual
) => useSelector(fn, equalityFn);
