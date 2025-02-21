import {isomorphicSaga} from '../../core/functions/isomorphic-saga';

export const webSaga = function* () {
	yield isomorphicSaga();
};
