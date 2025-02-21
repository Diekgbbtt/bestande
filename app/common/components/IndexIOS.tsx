import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {store} from '../../../core/reducers/store';
import {Main} from './Main';

class IndexIOS extends Component {
	render() {
		return (
			<Provider store={store}>
				<Main />
			</Provider>
		);
	}
}

// ts-unused-exports:disable-next-line
export default IndexIOS;
