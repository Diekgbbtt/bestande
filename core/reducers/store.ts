import {Action, applyMiddleware, compose, createStore} from 'redux';
import {enableBatching} from 'redux-batched-actions';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';
import {App} from '../../core/reducers';
import {AppState} from '../../core/types/app-state';
import {getReady} from '../actions/ready';
//import {NetworkManager} from '../components/NetworkManager';
import {mySaga} from './saga';

const sagaMiddleware = createSagaMiddleware<AppState>();

// @ts-expect-error
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancer = compose(applyMiddleware(thunk, sagaMiddleware));

export const store = createStore<ReturnType<typeof App>, Action<any>, any, any>(
	enableBatching(App),
	process.env.NODE_ENV === 'production'
		? compose(enhancer)
		: composeEnhancers(enhancer)
);

store.dispatch(getReady());

sagaMiddleware.run(mySaga);

