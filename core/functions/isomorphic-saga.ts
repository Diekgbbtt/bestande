import {select, takeEvery} from 'redux-saga/effects';
import {SET_SHOW_CALORIES} from '../reducers/food';
import {UniversalState} from '../types/universalState';
import {setAsyncIsomorphic} from './isomorphic-async-storage';

function* setShowCalories() {
	const showCalories = yield select((s: UniversalState) => {
		return s.food.showCalories;
	});
	yield setAsyncIsomorphic('showCalories', String(showCalories));
}

export function* isomorphicSaga() {
	yield takeEvery(SET_SHOW_CALORIES, setShowCalories);
}
