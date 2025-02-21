import {AnyAction, createStore, Store} from 'redux';
import {doLogin} from '../../core/actions/login';
import {User} from '../../core/types/ratings';
import indexReducer from './reducers';

export type MyCombinedState = {
	[key: string]: any;
};

const createInitialStore = (user: User) => {
	const store = createStore(indexReducer);

	if (user) {
		store.dispatch(doLogin(user));
	}

	return store;
};

// Export the createInitialStore function with the new type
export default createInitialStore as (
	user: User
) => Store<MyCombinedState, AnyAction>;
